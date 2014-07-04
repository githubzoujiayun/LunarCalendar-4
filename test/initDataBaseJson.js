$(document).ready(function() {
  var db;

  asyncTest('init database', function(){
    db = openDatabase('LunarCalendar','','LC',1024*1024*20);
    ok(db, 'database inited');
    start();
  });

  asyncTest('render database', function(){
    function renderNote(row) {
      // renders the note somewhere
      ok(true)
      //start();
    }
    function reportError(source, message) {
      // report error
      ok(false)
      console.log(message)
      //start();
    }
    function renderNotes(nodes) {
      db.transaction(function(tx) {
          tx.executeSql('CREATE TABLE IF NOT EXISTS calendar(nid INTEGER NOT NULL, year TEXT NOT NULL, month TEXT NOT NULL, day TEXT NOT NULL, good TEXT, bad TEXT)', [],
          function(tx, rs) {
            //console.log(nodes)
            for (var i = 0; i < nodes.length; i++) {
              insertNote(nodes[i],i,nodes.length);
            };
            ok(true,' database init success:' + rs);
          },
          function(tx, error) {
            ok(false,' database init failed by:' + error);
          });
        });
      ok(true,'finished init');
      //start();
    }
    function insertNote(node,index,maxLen) {
      db.transaction(function(tx) {
        tx.executeSql('INSERT INTO calendar(nid, year, month, day, good, bad) VALUES(?, ?, ?, ?, ?, ?)', [node.ID, node.N1, node.N2, node.N3, node.N4, node.N5],
          function(tx, rs) {
            //console.log(index,node);
            ok(true,'No ' + index);
            console.log(index,maxLen)
            if(index == maxLen)
              start();
          },
          function(tx, error) {
            //console.log(index,node,error);
            ok(false, String(error.message));
            console.log(index,maxLen,error.message)
            if(index == maxLen)
              start();
          });
      });
    }
    $.ajax({
      type: "GET",
      url: "../data/data1920-1940.json",
      dataType: "json",
      success: function (json) {
        renderNotes(json);
      },
      error: function (er) {
        ok(false,er);
        start();
      }
    });
  })

  asyncTest('search data', function(){

  })
});