$(document).ready(function() {
  asyncTest('load 2020.xml', function(){  
    $.ajax({
      type: "GET",
      url: "../data/2020.xml",
      dataType: "xml",
      success: function (xml) {
        ok(true);
        var childNodes = xml.firstChild.childNodes;
        var node0 = childNodes[0];
        //alert($(node0));
        start();
      },
      error: function (er) {
        start();
        ok(false);
      }
    });
  })
  asyncTest('load calendar.xml', function(){
    $.ajax({
      type: "GET",
      url: "../data/calendar.xml",
      dataType: "xml",
      success: function (xml) {
        ok(true);
        var childNodes = xml.firstChild.childNodes;
        var node0 = childNodes[0];
        //alert($(node0));
        start();
      },
      error: function (er) {
        start();
        ok(false);
      }
    });
  })
});