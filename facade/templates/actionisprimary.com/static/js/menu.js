function toggleMenu($el, $trigger, $backdrop){
  if($el.data('visible')){
    $el.hide();
    $trigger.html('menu');
    $trigger.removeClass('open');
    $backdrop.fadeOut();
    $el.data('visible', false);
  } else {
    $el.show();
    $trigger.html('close');
    $trigger.addClass('open');
    $backdrop.fadeIn();
    $el.data('visible', true);
  }
}

function initMenu(nav, trigger){
  var nav = $(nav);
  var close = nav.find('.close');
  var trigger = $(trigger);
  var backdrop = $('<div>').addClass('backdrop').appendTo('body');
  nav.data('visible', false);
  nav.hide();
  fn = toggleMenu.bind(null, nav, trigger, backdrop);
  trigger.click(fn);
  backdrop.click(fn);
  close.click(fn);
}

$(document).ready(function(){
  initMenu('#nav', '#nav-hide-show');
})
