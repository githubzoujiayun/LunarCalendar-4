test('init almanac', function() {
  //stop();
  ok(typeof almanac !== 'undefined','almanac init success');
});

asyncTest('get a luck info of today',function(){
  almanac.getLuckToday(function(luckToday){
    start();
    ok(typeof luckToday !== 'undefined', '今天 宜：' +luckToday.good );
  });
})
asyncTest('get a luck info of 2012/03/04 ',function(){
  almanac.getLuck('2012/03/04',function(luckDate){
    start();
    ok(typeof luckDate !== 'undefined','2012/03/04 不宜：' + luckDate.bad );    
  });
})
asyncTest('search a good day for 入学 2013/01/01 2013/02/04 ',function(){
  almanac.pickDay('入学', '2013/01/01', '2013/02/04', function(results){
    start();
    var result = results[0].result; 
    ok(results.length > 0,'入学 2013/01/01 2013/02/04' + result[0]);    
  });
})