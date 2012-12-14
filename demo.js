var headers, host, projectName, projectScopeId, queryOpts, service, setupApp, whereCriteria, contentType, whereParams;

projectName = "'System (All Projects)'";

projectScopeId = null;

host = "http://platform-dev";

service = host + "/CustomerTest/rest-1.v1/Data/";

contentType = "hal+json";

queryOpts = {
  acceptFormat: contentType
};

headers = {
  Authorization: "Basic " + btoa("admin:Admin101#")
};

whereCriteria = {
  Name: projectName
};

whereParams = {
    acceptFormat: contentType,
    sel: ""        
};

$.ajax({
  url: service + "Scope" + "?where=" + $.param(whereCriteria) + "&" + $.param(whereParams),
  headers: headers,
  type: "GET"
}).done(function(data) {
  projectScopeId = data._links.self.id;
  return setupApp();
});

setupApp = function() {
  var createDto, createStory, fields, init;
  fields = [
    {
      name: "RequestedBy",
      label: "Requested By",
      required: true,
      def: ""
    }, {
      name: "Name",
      required: true,        
      label: "Title",
      def: ""
    }, {
      name: "Description",
      label: "Description",
      required: false,
      def: "",
      type: "textarea",
      height: 200
    }
  ];
  createStory = function() {
    var dtoResult = createDto();
    if (dtoResult[0] == true) {
      return;
    }
    clearErrors();
    var dto = dtoResult[1];
    return $.ajax({
      url: service + "Request" + "?" + $.param(queryOpts),
      headers: headers,
      type: "POST",
      data: JSON.stringify(dto),
      contentType: contentType
    }).done(function(data) {
      var item;
      item = $("<div></div>");
      item.html($("#requestItemTemplate").render(data));
      return $("#output").prepend(item);
    });
  };
  createDto = function() {
    var attributes;
    attributes = {};
    var hasError = false;
    $("#requestForm .inputField").each(function() {
      var el;
      el = $(this);
      var id = el.attr("id");
      var val = el.val();
      var required = el.attr("data-required");
      if (required == "true" && (val == null || val == "undefined" || val == "")) {
        hasError = true;
        var error = $("#err" + id)
        var label = error.attr("data-label");
        error.text(label + " is required");
      }      
      return attributes[id] = el.val();
    });
    attributes._links = {
      Scope: {
        idref: projectScopeId
      }
    };
    return [hasError, attributes];
  };
  clearErrors = function() {
    $(".error").text("");
  };
  init = function() {
    return $("#requestForm").html($("#fieldsTemplate").render({
      fields: fields
    }));
  };
  $(init);
  return $("#run").click(createStory);
};​