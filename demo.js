var headers, host, projectName, projectScopeId, queryOpts, service, setupApp, whereCriteria;

projectName = "'System (All Projects)'";

projectScopeId = null;

host = "http://platform-dev";

service = host + "/CustomerTest/rest-1.v1/Data/";

queryOpts = {
  acceptFormat: "hal+json"
};

headers = {
  Authorization: "Basic " + btoa("admin:Admin101#")
};

whereCriteria = {
  Name: projectName
};

$.ajax({
  url: service + "Scope" + "?where=" + $.param(whereCriteria) + "&acceptFormat=hal%2bjson&sel=",
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
      def: ""
    }, {
      name: "Name",
      label: "Title",
      def: ""
    }, {
      name: "Description",
      label: "Description",
      def: "",
      type: "textarea",
      height: 100
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
      contentType: "hal+json"
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
    $("#requestForm input[type='text']").each(function() {
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
  return $("#run").click(createStory​);
};
