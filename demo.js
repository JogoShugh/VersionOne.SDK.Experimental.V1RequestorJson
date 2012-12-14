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
      def: "",
      type: "textarea",
      height: 200
    }
  ];
  createStory = function() {
    var dto;
    dto = createDto();
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
    $("#requestForm .inputField").each(function() {
      var el;
      el = $(this);
      return attributes[el.attr("id")] = el.val();
    });
    attributes._links = {
      Scope: {
        idref: projectScopeId
      }
    };
    return attributes;
  };
  init = function() {
    return $("#requestForm").html($("#fieldsTemplate").render({
      fields: fields
    }));
  };
  $(init);
  return $("#run").click(createStory);
};​