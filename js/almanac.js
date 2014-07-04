/*
 *author:eric.zeng
 *date:4/2/2013
 *description: Chinese almanac that can get the luck or bad omen info,
 *             and search for several days that luck or bad to do something.
 */
var almanac = (function(){
  var my = {},
      dataSet = {},
      $root = $(document),
      _checkRange = function _checkRangeF(year){
        var range;
        for (range = 1900; range <= year; range+=20){};
        return range;
      },
      _getDataFileName = function _getDataFileNameF(range){
        return 'data/data'+ (range-20) + '-' + range +'.json';
      },
      _getDayData = function _getDayDataF(dataSet, callback, date){
        var i,
        year,
        month,
        day,
        luckInfo,
        start,
        range,
        dist;
        if(!dataSet)return false;
        if(!date)date = new Date();
        year = date.getFullYear();
        month = date.getMonth()+1;
        day = date.getDate();
        range = _checkRange(year);
        start = (year-range+19)*360;
        dist = start + (year-range+19)*5 + 365;
        //if(!dataSet[start])return false;
        for(i=start;i<dist;i++){
          if(dataSet[i].N1==year
            &&dataSet[i].N2==month
            &&dataSet[i].N3==day){
            luckInfo = dataSet[i];
          }
        }
        if(typeof luckInfo === 'undefined'){
          alert('no data find!');
          return false;
        }else{
          if(callback)
            return callback(luckInfo);
          else
            return luckInfo;
        }
      },
      _loadDate = function _loadDateF(date, callback){
        var now, 
            targetRange, 
            i;
        //console.log(date)
        try{
          now = new Date(date).getFullYear();
        }catch(e){
          throw e;
        }
        if(now > 1901 && now < 2100){
          targetRange = _checkRange(now);
          //console.log(targetRange)
          if(!my.dataLoading)
            $.ajax({
              type: "GET",
              url: _getDataFileName(targetRange),
              dataType: "json",
              success: function (json) {
                if(!dataSet['data'+targetRange]){
                  dataSet['data'+targetRange] = json;
                  $root.trigger('loaded'+targetRange);
                }
                //console.log('load success ', dataSet, date);
                my.dataLoading = false;
                if(callback)
                  callback(json, date);
              },
              error: function (er) {
                console.log('load failed', er, date);
                my.dataLoading = false;
                if(callback)
                  callback(null, date);
              }
            });
          my.dataLoading = true;
        }else{
          alert('The Date is Valid');
        }
      },
      //Asyn or Sync
      _getDay = function _getDayF(date, callback){
        var _date = new Date(date),
            _year = _date.getFullYear(),
            targetRange;
        //console.log(date,_date,_year)
        targetRange = _checkRange(_year);
        if(typeof dataSet['data'+targetRange] === 'undefined'){
          console.log('load: ' + targetRange)
          _loadDate(_date, function(_dataSet){
            _getDayData(_dataSet, callback, _date);
          });
          return false;
        }else{
          if(callback){
            callback(_getDayData(dataSet['data'+targetRange],undefined,_date));
          }else
            return _getDayData(dataSet['data'+targetRange],undefined,_date);
        }
      };
  my.init = (function(){
    _loadDate(new Date());
    return true;
  })();
  my.getLuckToday = function getLuckTodayF(callback){
    if(callback){
      return my.getLuck(new Date(), callback);
    }else
      return my.getLuck(new Date());
  };

  /*
   *para: string date
   *para: function callback
   *return: obj good/bad luck
   */
  my.getLuck = function getLuckF(date, callback){
    var result = {},
        _tmp;
    if(callback){
      _getDay(date, function(tmp){
        if(tmp&&tmp.N4)
          result.good = tmp.N4;
        else
          result.good = '未知';
        if(tmp&&tmp.N5)
          result.bad = tmp.N5;
        else
          result.bad = '未知';
        callback(result);
      });
    }else{
      _tmp = _getDay(date);
      if(_tmp&&_tmp.N4)
        result.good = _tmp.N4;
      else
        result.good = '未知';
      if(_tmp&&_tmp.N5)
        result.bad = _tmp.N5;
      else
        result.bad = '未知';
      return result;      
    }
  };
  /*
   *para: str string(good/bad must be one of the given list)
   *para: startDate date
   *para: endDate date
   *return: array []
   */
  my.searchPool = [];
  my.searchStat = false;
  my.pickDay = function pickDayF(str, startDate, endDate, callback){
    var i,
        year,
        month,
        day,
        reg,
        //check if the pool is totally finished, and set the current index finished.
        _checkSearchPool = function _checkSearchPoolF(index){
          var i;
          my.searchPool[index].stat = true;
          my.searchStat = false;
          for (i = 0; i < my.searchPool.length; i++) {            
            if(!my.searchPool[i].stat)return false;
          }
          my.searchStat = true;
          return true;
        },
        _searchDataset = function _searchDatasetF(_dataSet, _start_date, _end_date, _index){
          var i,
              _theDay,
              _tmp = [],
              _reg = new RegExp(str,'ig'),
              _start = _start_date.getFullYear(),
              _end = _end_date.getFullYear(),
              _blockLength = _start - _end,
              _range = _checkRange(_end),
              _startIndex = (_start - _range + 19)*365,
              _endIndex = _startIndex + 386;
          for (i = _startIndex; i < _endIndex; i++) {
            _theDay = _dataSet[i];
            if(_theDay&&_theDay.N1>=_start&&_theDay.N1<=_end){
              if(_reg.test(_theDay.N4)){
                _tmp.push(_theDay.N1+'/'+_theDay.N2+'/'+_theDay.N3);
                _tmp.push(_theDay.N4);
                _tmp.push(_theDay.N5);
                my.searchPool[_index].result.push(_tmp);
                _tmp = [];
              }   
            }
          };
          if(_checkSearchPool(_index)&&callback){
            callback(my.searchPool);
          }
        },
        _initSearch = function _initSearchF(start, end){
          var i,
              _startDate = new Date(start),
              _endDate = new Date(end),
              _start = _checkRange(_startDate.getFullYear()),
              _end = _checkRange(_endDate.getFullYear()),
              searchStart,
              searchEnd,
              blockLength = (_end - _start)/20;

          my.searchPool = [];
          my.searchStat = true;
          for (i = 0; i <= blockLength; i++) {
            my.searchPool[i] = {};
            my.searchPool[i].stat = false;
            my.searchPool[i].result = [];

            //set the start time for searching
            if(i==0)
              searchStart = _startDate;
            else
              searchStart = new Date((_start + 20*i - 19) + '/01/01');

            //set the end time for searching, do not care if the 31 day exist.
            if(i==blockLength)
              searchEnd = _endDate;
            else
              searchEnd = new Date((_start+20*i) + '/12/31');

            if(dataSet['data'+(_start+20*i)])
              (function(_index){
                _searchDataset(dataSet['data'+(_start+20*i)], searchStart, searchEnd, _index);
                //console.log(dataSet['data'+(_start+20*i)], searchStart, searchEnd, _index)
              })(i);
            else
              _loadDate(_start+20*i, (function(_index){
                return function(_dataSet){
                  _searchDataset(_dataSet, searchStart, searchEnd, _index);
                  //console.log(dataSet['data'+(_start+20*i)], searchStart, searchEnd, _index)
                };
              })(i));
          };
        };
        _initSearch(startDate, endDate);
  };
  return my;
})();