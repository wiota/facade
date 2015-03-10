(function(container, options){
  // requires jquery
  var scrub_bar = DEFACE.create('scrub_bar');

  scrub_bar.prototype.init = function(container){

    this.container = $(container);
    this._bar = this.container.children().first();

    // cached
    this._width = this.container.width();
    this._setup_interface();
  }

  // interface --------------------------

  scrub_bar.prototype._setup_interface = function(){
    var instance = this;
    this.container.on('touchstart', function(e){})

    this.container.on('touchend', function(e){})

    this.container.on('mousedown', function(e){
      if(e.which!=1){ // if not primary mouse button
        return false;
      }
      instance._start_track(e);
      e.preventDefault();
      return false;
    })

  }

  // how can I break off this mouse tracking code?

  scrub_bar.prototype._clamp = function(min, val, max){
    if(val<=min){
      return min;
    } else if (val>=max){
      return max;
    } else {
      return val;
    }
  }

  scrub_bar.prototype._start_track = function(evt){
    $(window).on('mousemove.scrub_bar', this._track.bind(this));
    $(window).on('mouseup.scrub_bar', this._stop_track.bind(this));
    this._track(evt);
    console.log('start');
  }

  scrub_bar.prototype._track = function(evt){
    var x_ratio = (evt.pageX - this.container.offset().left)/this._width;
    var percent = this._clamp(0,x_ratio,1) * 100;
    this.set(percent);
    this.trigger('track', percent);
  }

  scrub_bar.prototype._stop_track = function(evt){
    $(window).off('mousemove.scrub_bar');
    $(window).off('mouseup.scrub_bar');
    console.log('stop');
  }

  scrub_bar.prototype.set = function(percent){
    this._bar.width(percent+"%");
    return percent;
  }

})()