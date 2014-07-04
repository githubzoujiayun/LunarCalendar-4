//Initialize function
var appInit = function () {
    //init test case
    SUIT.testCaseInit();

    var $root = $(document),
        $SUI = $('#StcUI'),
        $head = $('#header'),
        $foot = $('#footer'),
        $modal = $('#StcUI_modal');

    $('body').height($(window).height());
    $('body').width($(window).width());

    //show the splash screen TODO
    SUIT.showSplash();

    //do after load data
    $root.on('loaded2020', function(e){
      SUIT.hideSplash();
      //calendar init
      var cal = Calendar({
        rootElement:'#calendar'
      });

      //almanac init
      almanac.getLuckToday(function(obj){
        if(obj.good)
          $foot.find('.good_text').text(obj.good);
        if(obj.bad)
          $foot.find('.bad_text').text(obj.bad);
      });    

      //add event to header button

      SUIT.initModal();

      //select date part
      $SUI.find('.select_date').on('click', function(e){
        SUIT.popupOpen({
          title: 'ChooseDate',
          contentEl: $('#popupChooseDate')
        });
      })
      $SUI.find('#popupChooseDate .add_button').on('click', function(){
        var $this = $(this),
            $p = $('#popupChooseDate'),
            $input = $this.next(),
            value = Number($input.val()),
            year,month;
        if($input.hasClass('selecter_year')){
          if(value>=2100)return;
        }else if($input.hasClass('selecter_month')){
          if(value>=12)return;
        }else if($input.hasClass('selecter_day')){
          year = $p.find('.selecter_year').val();
          month = $p.find('.selecter_month').val();
          var _tmp = lunarConvertTool.getGregorianMonthDays(Number(year), Number(month)-1);
          if(value>=lunarConvertTool.getGregorianMonthDays(Number(year), Number(month)-1))return;

          if(value>=31)return;
        }else{
          alert('no input find')
        }
        $input.val(value+1);
      });
      $SUI.find('#popupChooseDate .dec_button').on('click', function(){
        var $this = $(this),
            $input = $this.prev(),
            value = Number($input.val());
        if($input.hasClass('selecter_year')){
          if(value<=1901)return;
        }else if($input.hasClass('selecter_month')){
          if(value<=1)return;
        }else if($input.hasClass('selecter_day')){
          if(value<=1)return;
        }else{
          alert('no input find')
        }
        $input.val(value-1);
      });
      $SUI.find('#popupChooseDate .setdate.button').on('click', function(e){
        var year,month,day,
            $popup = $('#popupChooseDate');
        year = $popup.find('.selecter_year').val();
        month = $('.selecter_month').val();
        day = $('.selecter_day').val();

        SUIT.modalSelectDate(new Date(year+'/'+month+'/'+day));
        SUIT.popupClose({
          popupEl:$popup
        });
      });
      $SUI.find('#popupChooseDate .settoday.button').on('click', function(e){
        var $popup = $('#popupChooseDate');
        SUIT.modalSelectDate();
        SUIT.popupClose({
          popupEl:$popup
        });
      });
      $SUI.find('#popupChooseDate .cancel.button').on('click', function(e){
        SUIT.popupClose({
          popupEl:$('#popupChooseDate')
        });
      });

      //pick day part
      SUIT.modalPickDayInit();
      $SUI.find('.pick_day').on('click', function(e){
        SUIT.popupOpen({
          title: 'PickDay',
          contentEl: $('#popupPickDay')
        });
      });
      $SUI.find('#popupPickDay .pick_day.button').on('click', function(e){
        var $popup = $('#popupPickDay'),
            str = $popup.find('#pick_string').val(),
            start = $popup.find('.start_date').val(),
            end = $popup.find('.end_date').val();

        SUIT.popupClose({
          popupEl:$('#popupPickDay'),
          callback: function(){
            SUIT.modalPickDay(str, start, end);
          }
        });
      });
      $SUI.find('#popupPickDay .cancel.button').on('click', function(e){
        SUIT.popupClose({
          popupEl:$('#popupPickDay')
        });
      });

    });

};

$(document).ready(appInit);