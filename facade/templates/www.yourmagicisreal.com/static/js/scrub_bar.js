var scrub_bar = function(container, options){
  // requires jquery

  // Private ----------------------------------------------

  var container = $(container);
  var bar = container.children().first();

  // cached
  var width = container.width()

  // options
  options = options || {}

  // interface --------------------------

  var setup_interface = function(){
    container.on('touchstart', function(e){

    })

    container.on('touchend', function(e){

    })

    container.on('mousedown', function(e){
      if(e.which!=1){ // if not primary mouse button
        return false;
      }
      start_track(e);
      e.preventDefault();
      return false;
    })

  }

  // how can I break off this mouse tracking code?

  var clamp = function(min, val, max){
    if(val<=min){
      return min;
    } else if (val>=max){
      return max;
    } else {
      return val;
    }
  }

  var start_track = function(e){
    console.log('start');
    $(window).on('mousemove',track)
    $(window).on('mouseup', stop_track)
    track(e);
  }

  var track = function(e){
    var percent = (e.pageX - container.offset().left)/width*100;
    set(clamp(0,percent,100));
    if(options.onTrack){
      options.onTrack(percent);
    }
  }

  var stop_track = function(e){
    console.log('stop');
    $(window).off('mousemove',track)
    $(window).off('mouseup',stop_track)
  }

  var set = function(percent){
    bar.width(percent+"%");
  }

  // Public -----------------------------------------------

  var init = function(){
    setup_interface();
  }

  init.prototype.set = function(percent){
    set(percent)
  }

  return new init();

}