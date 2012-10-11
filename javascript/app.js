
// namespace
window.application = {
  editor:"",
  apiLimit:1500
};

// Dom Ready
$(function(){

  $(".btn").each(function(){
    var self = this;
    $(self).bind("focus",$(self).tooltip({
      placement:"bottom",
      delay: { show: 300, hide: 100 }
    }))
  });
  // Initilize CodeMirror Editor
  application.editor = CodeMirror.fromTextArea(document.getElementById("in"), {
    mode: 'gfm',// github-flavored-markdown
    lineNumbers: true,
    matchBrackets: true,
    theme: "default",
    onFocus:function(){
      $(".CodeMirror-scroll").addClass("focus");
    },
    onBlur:function(){
      $(".CodeMirror-scroll").removeClass("focus");
    },
    onCursorActivity: function() {
      application.editor.setLineClass(hlLine, null, null);
      hlLine = application.editor.setLineClass(application.editor.getCursor().line, null, "activeline");
    }
  });
  var hlLine = application.editor.setLineClass(0, "activeline");

  // Initialize html view
  convert();
})

// convert markdown to html
function convert(){
  // save CodeMirror to textarea
  window.application.editor.save();

  // hide html
  var progressbar="<div id='progress' class='progress progress-info progress-striped active'><div id='bar' class='bar' style='width: 100%'></div></div>";
  $("#out").fadeOut().empty().append(progressbar); 
  
  // call github's API
  $.ajax({
    "url":"https://api.github.com/markdown/raw",
    "type":"POST",
    "contentType":"text/plain",
    "data":$("#in").val(),
    "complete":function(jqXHR, textStatus){
      // api limit count
      // console.log(jqXHR.getResponseHeader("X-RateLimit-Remaining"));
      application.apiLimit = jqXHR.getResponseHeader("X-RateLimit-Remaining");
    }
  })
  .done(function(data){
    // console.log("done");
    // render html data
    $("#out").addClass("display-none").append(data).fadeIn();    
    $("#progress").remove();
  })
  .fail(function(data){
    // console.log("fail");
    // alert dialogue
  })
  .always(function(data){
    // console.log("always");
    // do nothing.
  })
}

// showAlert
function showAlert(msg){
  $("#alertMessage>p").text(msg);
  $("#alertMessage")
  .removeClass("display-none")
  .removeClass("out")
  .addClass("in")
  .bind("close", function (evt) {
    evt.preventDefault();
    $(this)
    .removeClass("in")
    .addClass("out")
    .trigger("closed");
  })
  .bind("closed", function () {
    var self = this;
    setTimeout(function(){
      $(self).addClass("display-none")
    },500);
  });
}

