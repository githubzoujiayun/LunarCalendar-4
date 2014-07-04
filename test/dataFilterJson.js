$(document).ready(function() {
  asyncTest('load data2000-2020.json', function(){  
    $.ajax({
      type: "GET",
      url: "../data/data2000-2020.json",
      dataType: "json",
      success: function (json) {
        start();
        ok(true);
        var childNodes = json;
        var node0 = childNodes[0];
        //alert($(node0));
      },
      error: function (er) {
        start();
        ok(false);
      }
    });
  })
  asyncTest('load data.json', function(){
    $.ajax({
      type: "GET",
      url: "../data/data.json",
      dataType: "json",
      success: function (json) {
        start();
        ok(true);
        var childNodes = json;
        var node0 = childNodes[0];
        //alert($(node0));
      },
      error: function (er) {
        start();
        ok(false);
      }
    });
  })
});