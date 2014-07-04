/*
 *author:eric.zeng
 *date:4/2/2013
 *description: global used function for this app from STC CX BU
 *dom elements dependence: 
 *  general: #StcUI #StcUI_splashscreen #StcUI_modal 
 *           #StcUI_overlay #StcUI_popup #StcUI_mask
 *  custom: #popupChooseDate #popupPickDay
 */
var SUIT = (function(){
  var my = {};

  var _weekday = ['日', '一', '二', '三', '四', '五', '六'],
      _monthEnglish = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
  my.init = (function(){
    return true;
  })();

  my.splashStat = false;
  //show splash screen
  my.showSplash = function showSplashF(){
    if(!my.splashStat)
      $('#StcUI_splashscreen').show();
    my.splashStat = true;
  };
  //hide splash screen
  my.hideSplash = function hideSplashF(){
    if(my.splashStat)
      $('#StcUI_splashscreen').fadeOut('fast');
    my.splashStat = false;
  };

  //open a popup
  my.popupOpen = function popupOpenF(options){
    var i,$p = $('#StcUI'),$overlay = $('#StcUI_overlay'),
        $popup = $('#StcUI_popup'),
        _default = {
          title: 'Warning',
          transition: 'fade',
          contentEl: undefined,
          content: '',
          autoClose: true,
          hasOK: false,
          beforeShow: function(){},
          callback: function(){}
        },
        _checkEls = function _checkElsF(){
          if($overlay.length==0 || $popup.length==0)return false;
          return true;
        },
        _initEls = function _initElsF(){
          if($overlay.length==0)
            $overlay = $('<div id="StcUI_overlay"></div>');

          if($popup.length==0)
            $popup = $('<div id="StcUI_popup" class="stc-ui-popup"><h1 class="title"></h1><div class="popup_content"></div></div>');
          $p.append($overlay).append($popup);
        },
        _apendEls = function _apendElsF(){
          var $contEl = $popup.find('.popup_content'),
              $t = $popup.find('.title'),
              $ok = $popup.find('.okWrap'),
              contWidth;

          //extend the settings
          $.extend(_default, options);


          //init content elements
          if(_default.contentEl){
            $popup = _default.contentEl;
          }else{
            //init text content
            $t.text(_default.title);
            $contEl.text(_default.content);
          }
          //add ok button 
          if(_default.hasOK){
            if($ok.length==0)
              $ok = $('<div class="okWrap"><span class="OKButton">确定</span></div>');
            $popup.append($ok);
            $ok.on('click', (function(popup){
              return function(e){
                my.popupClose({
                  popupEl: popup
                });
              }
            })($popup));
          }else if($ok.length>0)
            $ok.remove();


          //set the popup in the middle
          contWidth = $popup.width();
          contHeight = $popup.height();
          $popup.css({
            width: contWidth,
            height: contHeight,
            'margin-left': -contWidth/2,
            'margin-top': -contHeight/2
          });

          //add click event to close the popup
          if(_default.autoClose)
            $overlay.on('click', (function(popup,callback){
              return function(e){
                my.popupClose({
                  popupEl: popup,
                  callback:callback
                });
              }
            })($popup,_default.callback));

          //show the popup
          $overlay.fadeIn('fast',function(){
            $popup.fadeIn('fast',function(){
              if(_default.beforeShow)
                _default.beforeShow();
            });
          });
        };
    if(!_checkEls()){
      _initEls();
    }
    _apendEls();
  };
  my.popupClose = function popupCloseF(options){
    var $overlay = $('#StcUI_overlay'),
        $popup = $('#StcUI_popup'),
        _default = {
          popupEl:$popup,
          transition: 'fade',
          callback: function(){}
        };
    $.extend(_default, options);
    $popup = _default.popupEl;
    if($overlay.length>0&&$overlay.css('display')!='none')
      $overlay.fadeOut('fast', function(){
        if($popup.length>0&&$popup.css('display')!='none')
          $popup.fadeOut('normal',_default.callback);
      });
  };

  //overwrite the alert function by popup
  my.alert = function alertF(str){
    my.popupOpen({
      content: str,
      hasOK: true
    });
  };
  window.alert = my.alert;

  //modal funtions
  //init modal
  my.initModal = function initModalF(){
    var $modal = $('#StcUI_modal');
    $modal.find('.back').on('click', function(e){
      my.modalHide(my.modalfunc);
    });
  };

  //modal page show animation functions
  my.modalfunc = '';
  my.modalShow = function modalShowF(tranStr){
    var $modal = $('#StcUI_modal'),
        funs = {};
    funs.flip = function flipF(){
      $modal.parent().addClass('tran3dParentFar');
      $modal.addClass('tran3dFlipRight animate1s');
      window.setTimeout(function(){
        $modal.css({
          '-webkit-transform': 'rotateY(0deg)'
        });        
      },0);
    };
    funs.fade = function fadeF(){
      $modal.fadeIn();
    };
    funs.slide = function slideF(){

    };
    if(funs[tranStr]){      
      funs[tranStr]();
      my.modalfunc = tranStr;
    }
    else if(tranStr === ''){
      funs.fade();
    }
    else
      alert('transition function not exist!')
  }
  my.modalHide = function modalHideF(tranStr){
    var $modal = $('#StcUI_modal'),
        funs = {};
    my.modalfunc = '';
    funs.flip = function flipF(){
        $modal.css({
          '-webkit-transform': 'rotateY(90deg)'
        });
    };
    funs.fade = function fadeF(){
      $modal.fadeOut();
    };
    funs.slide = function slideF(){

    };
    if(funs[tranStr])
      funs[tranStr]();
    else
      alert('transition function not exist!')
  }

  //fill the template of detail page
  my.resultData = {
    currentDay:{
      lunar: undefined,
      good: '',
      bad: ''
    },
    _next: undefined,
    _prev: undefined,
    type: '',
    list: [],
    index: 0,
    init: function(_type, _date){
      var _self = my.resultData,
          _cur,
          _arg = arguments,
          _list,_index,_prev,_next;
      _self.type = _type;
      _self.currentDay = _date;
      _cur = _self.currentDay.lunar;
      if(_type == 'select'){
        _self._next = _cur.getNextDay().date;
        _self._prev = _cur.getPrevDay().date;
      }else if(_type == 'pick'){
        _list = _arg[2];
        _index = _arg[3];
        if(_list[_index+1])
          _self._next = _list[_index+1].date;
        else
          _self._next = undefined;
        if(_list[_index-1])
          _self._prev = _list[_index-1].date;
        else
          _self._prev = undefined;
        _self.list = _list;
      }else
        alert('undefined init type')
      my.resultData = _self;
    },
    render: function(_date){
      var _self = my.resultData,
          _cur = _self.currentDay.lunar;

      if(_cur.month == 0){
        almanac.getLuck(''+(_cur.year-1)+'/01/01', function(){});
      }else if(_cur.month == 11){
        almanac.getLuck(''+(_cur.year+1)+'/01/01', function(){});
      }
      if(_self.type == 'select'){
        _self.currentDay = almanac.getLuck(_date);
        _self.currentDay.lunar = new Lunar(new Date(_date));
        _self._next = _self.currentDay.lunar.getNextDay().date;
        _self._prev = _self.currentDay.lunar.getPrevDay().date;       
      }else if(_self.type == 'pick'){
        _self.currentDay = _self.list[_date];
        if(_self.list[_date+1])
          _self._next = _self.list[_date+1].date;
        else{
              _self._next = undefined;
              my.resultData = _self;
              return;
            }
        if(_self.list[_date-1])
          _self._prev = _self.list[_date-1].date;
        else{
              _self._prev = undefined;
              my.resultData = _self;
              return;
            }
        _self.index = _date;
        my.resultData = _self;
      }
    },
    next: function(){
      var _self = my.resultData;
      if(!_self._next)
        return false;
      if(_self.type == 'select')
        my.resultData.render(_self._next);
      else{
        my.resultData.render(_self.index+1)
      }
      return _self.currentDay;
    },
    prev: function(){
      var _self = my.resultData;
      if(!_self._prev)
        return false;
      if(_self.type == 'select')
        _self.render(_self._prev);
      else{
        _self.render(_self.index-1)
      }
      
      return _self.currentDay;
    }
  };
  my.modifyDetail = function modifyDetailF($contentEl){
   var $modal = $('#StcUI_modal'),
        $list = $modal.find('.dateNav .day_list'),
        _curDay = my.resultData.currentDay,
        _list = my.resultData.list,
        _index = my.resultData.input;

    //highlight the current item
    if(my.resultData.type=='pick'&&_curDay.$el){
      $list.find('.current.nav_item').removeClass('current');
      _curDay.$el.addClass('current animate');
    }
    //console.log(_curDay);

    $contentEl.find('.dateTitle .currentYear').text(_curDay.lunar.year+'年');
    $contentEl.find('.currentMonth .month').text(_curDay.lunar.month+1+'月');
    $contentEl.find('.currentMonth .monthE').text(_monthEnglish[_curDay.lunar.month]);
    $contentEl.find('.currentDateWrap .currentLunaryear').text(_curDay.lunar.lunarYearEraName+'年');
    $contentEl.find('.currentDateWrap .currentLunarAnimal').text(_curDay.lunar.chineseZodiac+'年');
    $contentEl.find('.dateDetail .lunarDate').text(_curDay.lunar.chineseLunarMonth+'月'+_curDay.lunar.chineseLunarDay);
    $contentEl.find('.dateDetail .dateDay').text(_curDay.lunar.day);
    $contentEl.find('.dateDetail .currentDay').text('星期'+_weekday[_curDay.lunar.weekday]);
    $contentEl.find('.dateDetail .currentFes').text(_curDay.lunar.gregorianFestival ? _curDay.lunar.gregorianFestival : '');
    $contentEl.find('.dateDetail .lunarEraDate').text(_curDay.lunar.lunarMonthEraName+'月'+_curDay.lunar.lunarDayEraName+'日');
    $contentEl.find('.cuurentAlmanac .good').text(_curDay.good);
    $contentEl.find('.cuurentAlmanac .bad').text(_curDay.bad);
  };
  my.showDetailDateInfo = function _showDateInfoF(){
    var $modal = $('#StcUI_modal'),
        $list = $modal.find('.dateNav .day_list'),
        _curDay = my.resultData.currentDay,
        _list = my.resultData.list,
        _index = my.resultData.input;

    //highlight the current item
    if(my.resultData.type=='pick'&&_curDay.$el){
      $list.find('.current.nav_item').removeClass('current');
      _curDay.$el.addClass('current animate');
    }
    //console.log(_curDay);

    $modal.find('.dateTitle .currentYear').text(_curDay.lunar.year+'年');
    $modal.find('.currentMonth .month').text(_curDay.lunar.month+1+'月');
    $modal.find('.currentMonth .monthE').text(_monthEnglish[_curDay.lunar.month]);
    $modal.find('.currentDateWrap .currentLunaryear').text(_curDay.lunar.lunarYearEraName+'年');
    $modal.find('.currentDateWrap .currentLunarAnimal').text(_curDay.lunar.chineseZodiac+'年');
    $modal.find('.dateDetail .lunarDate').text(_curDay.lunar.chineseLunarMonth+'月'+_curDay.lunar.chineseLunarDay);
    $modal.find('.dateDetail .dateDay').text(_curDay.lunar.day);
    $modal.find('.dateDetail .currentDay').text('星期'+_weekday[_curDay.lunar.weekday]);
    $modal.find('.dateDetail .currentFes').text(_curDay.lunar.gregorianFestival ? _curDay.lunar.gregorianFestival : '');
    $modal.find('.dateDetail .lunarEraDate').text(_curDay.lunar.lunarMonthEraName+'月'+_curDay.lunar.lunarDayEraName+'日');
    $modal.find('.cuurentAlmanac .good').text(_curDay.good);
    $modal.find('.cuurentAlmanac .bad').text(_curDay.bad);
  };
  my.switchDetail = function switchDetailF(date, funcStr, callback){
    var $modal = $('#StcUI_modal'),
        $content = $modal.find('.currentDateWrap:eq(0)'),
        $detailNew = $content.clone().addClass('newM animate transform'),
        _WIDTH = $(window).width();
    if(funcStr == 'out'){
      $detailNew.addClass('out')
    }
    my.modifyDetail($detailNew);
    $content.after($detailNew);
    $detailNew.on('transitionend', function(){
        $(this).remove();
        if(callback)
          callback();
        else
          my.showDetailDateInfo();
    });
    window.setTimeout((function(){
      return function(){
        $detailNew.addClass('inPosition');
      };      
    })(),0)
  };
  my.addDetailSwipe = function addDetailSwipeF(){
      var $modal = $('#StcUI_modal'),
          $content = $modal.find('.currentDateWrap:eq(0)'),
          $list = $modal.find('.dateNav .day_list');

      //console.log(_opt,_list,_index)
      $content.off('swipeleft').off('swiperight')
      .on('swipeleft', function(e){
        if(my.resultData.next()){
          //my.showDetailDateInfo();
          my.switchDetail(my.resultData.currentDay.lunar.date);
          if(my.resultData.type == 'pick'){
            $list.find('.current.nav_item').removeClass('current');
            $list.find('.nav_item').eq(my.resultData.index).addClass('current');
          }
        }        
      })
      .on('swiperight', function(e){
        if(my.resultData.prev()){
          //my.showDetailDateInfo();
          my.switchDetail(my.resultData.currentDay.lunar.date,'out');
          if(my.resultData.type == 'pick'){
            $list.find('.current.nav_item').removeClass('current');
            $list.find('.nav_item').eq(my.resultData.index).addClass('current');
          }
        }
      });
      return true;
    };

  //modal for select date
  my.modalSelectDate = function modalSelectDateF(date){
    var $modal = $('#StcUI_modal'),
        $content = $modal.find('.currentDateWrap:eq(0)');
    if(!date)
      date = new Date();
    var cur_date = new Lunar(date);
    //change title
    $modal.find('.headTitle').text('农历黄历详情');
    //change button
    $modal.find('.innerFooter .select_date').show();
    $modal.find('.innerFooter .pick_day').hide();

    //get and fill lunar date
    almanac.getLuck(date, function(_luckObj){
      var _opt = {
        lunar: cur_date,
        good: _luckObj.good,
        bad: _luckObj.bad
      };
      my.resultData.init('select', _opt, _opt.lunar.getNextDay(), _opt.lunar.getPrevDay());
      my.showDetailDateInfo();
      my.addDetailSwipe();
    });

    $modal.find('.dateNav').hide();

    //$modal.fadeIn('normal');
    my.modalShow('flip');
  };

  //modal for pick day
  my.modalPickDayInit = function modalPickDayInitF(){
    var $parent = $('#popupPickDay'),
        strList = ["入宅", "移徙", "出行", "进人口", "修造", "动土", "起基", "上梁", "安门", "造仓", "补垣", "塞穴", "造畜椆栖"],
        i,
        $p = $parent.find('#pick_string'),
        $chTmp = $('<option></option>'),
        $ch,
        $startDate = $parent.find('.start_date'),
        $endDate = $parent.find('.end_date'),
        now = new Date(),
        start = SUIT.dateFormat(now, 'yyyy-MM-dd'),
        end = start.replace(/-\d{2}-/,function(a){return '-'+a[1]+(Number(a[2])+1)+'-'});

    //init select
    if($p.length != 0 && $p.children().length == 0){
      for (i = 0; i < strList.length; i++) {
        $ch = $chTmp.clone().val(strList[i]).text(strList[i]);
        $p.append($ch);
      };
      $p.find('option:eq(0)').attr('default',true);
    }

    //init date input: current date to next month
    if($startDate.length>0)
      $startDate.val(start);
    if($endDate.length>0)
      $endDate.val(end);
  };
  my.modalPickDay = function modalPickDayF(str, startDate, endDate){
    var pickedList = [];
    var $modal = $('#StcUI_modal');

    //change title
    $modal.find('.headTitle').text('择日：'+ str);
    //change button
    $modal.find('.innerFooter .select_date').hide();
    $modal.find('.innerFooter .pick_day').show();

    almanac.pickDay(str, startDate, endDate, (function($modal){
      return function(days){
        var $list = $modal.find('.dateNav .day_list'),
            $itemList,
            _lunarList = [],
            _cur,
            _itemLength,
            _maxLength,
            _getX = function _getXF($el){
              var a = $el.attr('style'),
                  _x;
              if(a)
                _x = a.match(/.*translate\(([-+]?\d+)px.*/i);
              return a&&_x.length>1 ? Number(_x[1]) : 0;
            },
            _init_nav = function _init_navF(list){
              var _itemli = $('<li class="nav_item animate"><span class="dateNavDate"></span><span class="dateNavDay"></span></li>'),
                  i,j,_index = 0,
                  _startDate = new Date(startDate),
                  _endDate = new Date(endDate);
              $list.empty();
              if(list.length>0){
                for (i = 0; i < list.length; i++) {
                  var _result = list[i].result
                  for (j = 0; j < _result.length; j++) {
                    var _tmp = new Date(_result[j][0]);
                    if(_tmp<_startDate||_tmp>_endDate){
                      _tmp = null;
                      continue;
                    }
                    var _item = {};
                    _item.date = _result[j][0];
                    _item.lunar = new Lunar(new Date(_item.date));
                    _item.good = _result[j][1];
                    _item.bad = _result[j][2];

                    _item.$el = _itemli.clone();
                    //console.log(_item.date,_item.lunar.weekday)
                    $list.append(_item.$el);
                    _item.$el.find('.dateNavDate').text(_item.date.match(/^\d+\/(\d+\/\d+)$/)[1]);
                    _item.$el.find('.dateNavDay').text('('+_weekday[_item.lunar.weekday]+')');
                    _lunarList[_index] = _item;
                    _index++;
                    _item = null;
                  };
                  _result = null;
                };
                if(_lunarList.length>0)
                  return true;
                else
                  return false;
              }else
                return false;
            };

        //console.log(days);
        pickedList = days;
        $modal.find('.dateNav').show();
        if(!_init_nav(pickedList)){
          //TODO deal with no day picked
          $modal.find('.dateNav').hide();
          alert('在您选择的区间没有找到适合'+ str + '的日子。');
          return;
        }else{
          my.resultData.init('pick',_lunarList[0],_lunarList,0)
          my.showDetailDateInfo();
          my.addDetailSwipe();
        }
        //page in animate function
        //$modal.fadeIn();
        my.modalShow('flip');

        $list.removeAttr('style');
        $itemList = $list.find('.nav_item');
        _itemLength = $itemList.eq(0).outerWidth() + 4;
        $itemList.each(function(_index){
          var $thisItem = $(this);
          $thisItem.on('click', (function(_index){
            return function(e){
              var _x = - _itemLength * (_index + 0.5) + $(window).width()/2,
                  _$item = $(this);
              $list.addClass('animate transform')
              .css({
                '-webkit-transform': 'translate(' + _x + 'px,0px)'
              })
              .on('transitionend', function(e){
                $list.removeClass('animate1s transform');
              });
              $list.find('.current.nav_item').removeClass('current');
              $(this).addClass('current');
              my.resultData.render(_index);
              //my.showDetailDateInfo();
              my.addDetailSwipe();
              my.switchDetail(my.resultData.currentDay.lunar.date);
            };
          })(_index));          
        });

        _maxLength = _itemLength * ($itemList.length - 1);
        if(_maxLength<0)
          _maxLength = 40;

        $list.off('movestart').off('move').off('moveend')
        .on('movestart', function(e){
          var a = $list.attr('style'),
              _x;

          $list.removeClass('animate transform');
          if(a)
            _x = a.match(/.*translate\(([-+]?\d+)px.*/i);
          _cur = a&&_x.length>1 ? Number(_x[1]) : 0;
          //console.log(_cur,$itemList.length,_maxLength)
        })
        .on('move', function(e){
          var _x = e.distX + _cur;
          //makesure $list in the visible area and it will pull back
          if(_x > 40)
            _x = 40;
          else if(_x < -_maxLength)
            _x = -_maxLength;
          //console.log(_x,e.distX , _cur);
          $list.css({
            '-webkit-transform': 'translate(' + _x + 'px,0px)'
          });
        })
        .on('moveend', function(e){
          var _x,
              _offset;
          _x = _getX($list);
          _offset = _x%_itemLength;
          if(_offset!=0)
            _x = _x - _offset;
          //console.log(_x,_itemLength, _offset)
          $list.addClass('animate transform')
          .css({
            '-webkit-transform': 'translate(' + _x + 'px,0px)'
          });
        });
      };
    })($modal));
  };

  //date format like 'yyyy-MM-dd' 'MM-dd-yyyy' 'yyyy/MM/dd' etc.
  my.dateFormat = function (_date, fmt) { 
    var o = {
        "M+": _date.getMonth() + 1,
        "d+": _date.getDate(),
        "h+": _date.getHours(),
        "m+": _date.getMinutes(),
        "s+": _date.getSeconds(), 
        "q+": Math.floor((_date.getMonth() + 3) / 3),
        "S": _date.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };

  return my;
})()