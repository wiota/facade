(function(){
  // requires jquery
  var scrub_bar = DEFACE.create('scrub_bar');

  scrub_bar.prototype.init = function(container, scrub_bar, range_bar){

    this.$container = $(container);
    this.$scrub_bar = $(scrub_bar);
    this.$range_bar = $(range_bar);
    this._tracking = false;

    this._setup_interface();
  }

  // interface --------------------------

  scrub_bar.prototype._setup_interface = function(){
    var instance = this;
    this.$container.on('touchstart', function(evt){})

    this.$container.on('touchend', function(evt){})

    this.$container.on('mousedown', function(evt){
      if(evt.which!=1){ // if not primary mouse button
        return false;
      }
      instance._start_track(evt);
      evt.preventDefault();
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
    this._tracking = true;
    this._track(evt);
    console.log('start');
  }

  scrub_bar.prototype._track = function(evt){
    var x_ratio = (evt.pageX - this.$container.offset().left)/this.$container.width();
    var percent = this._clamp(0,x_ratio,1) * 100;
    this._set(this.$scrub_bar, 0, percent);
    this.trigger('track', percent);
  }

  scrub_bar.prototype._stop_track = function(evt){
    $(window).off('mousemove.scrub_bar');
    $(window).off('mouseup.scrub_bar');
    this._tracking = false;
    console.log('stop');
  }

  scrub_bar.prototype._set = function(bar, low, high){
    bar.css({'margin-left':low+"%"})
    bar.width((high-low)+"%");
  }

  scrub_bar.prototype.set = function(percent){
    if(!this._tracking){
      this._set(this.$scrub_bar, 0, percent);
    }
    return percent;
  }

  scrub_bar.prototype.set_range = function(low, high){
    this._set(this.$range_bar, low, high);
  }

})()