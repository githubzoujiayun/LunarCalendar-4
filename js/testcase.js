//common tools function for app from stc ui: STC UI Tools
var SUIT = (function(my){

  my.testCaseInit = function testCaseInitF(){
    var $tc = $('#test_case');
    if($tc.length>0){
      var $iframe = $tc.find('#test_iframe');
      $tc.find('.link>a').on('click',function(event){
        $iframe[0].src = this.href;
        if($iframe.css('display')=='none')
          $iframe.slideDown('normal');
        return false;
      });
      $tc.on('click','.test_case_toggle', function(e){
        var $this = $(this);
        $this.next().toggle();
      });
    }
  };

  return my;
})(SUIT)
