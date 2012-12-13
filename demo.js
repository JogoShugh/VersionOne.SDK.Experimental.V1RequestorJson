projectName = "'System (All Projects)'"
projectScopeId = null

host = "http://platform-dev"

service = host + "/CustomerTest/rest-1.v1/Data/"

queryOpts = acceptFormat: "hal+json"

headers = Authorization: "Basic " + btoa("admin:Admin101#")

whereCriteria = Name : projectName
  
$.ajax(
    url: service + "Scope" + "?where=" + $.param(whereCriteria) + "&acceptFormat=hal%2bjson&sel="
    headers: headers
    type: "GET"
  ).done (data) ->
    projectScopeId = data._links.self.id    
    setupApp()

setupApp = ->    
    fields = [
      name: "RequestedBy"
      label: "Requested By"
      def: ""
    ,  
      name: "Name"
      label: "Title"
      def: ""
    ,
      name: "Description"
      label: "Description"
      def: ""
      type: "textarea" # TODO
      height: 100
    ]
    
    createStory = ->
      dto = createDto()
      
      $.ajax(
        url: service + "Request" + "?" + $.param(queryOpts)
        headers: headers
        type: "POST"
        data: JSON.stringify(dto)
        contentType: "hal+json"
      ).done (data) ->
        item = $("<div></div>")
        item.html $("#requestItemTemplate").render(data)

        $("#output").prepend item
    
    createDto = ->
      attributes = {}
      
      $("#requestForm input[type='text']").each ->
        el = $(this)
        attributes[el.attr("id")] = el.val()
        
      attributes._links = Scope: { idref: projectScopeId }
      
      return attributes
    
    init = ->
      $("#requestForm").html $("#fieldsTemplate").render {fields: fields}
    
    $ init
    $("#run").click createStory​