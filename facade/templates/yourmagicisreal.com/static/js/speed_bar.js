(function(){

  var speed_bar = DEFACE.create('speed_bar');

  speed_bar.prototype.init = function(trigger, speed_bar, display){
    this.$trigger = $(trigger);
    this.$display = $(display);
    this.$speed_bar = $(speed_bar);

    this._timer;
    this._stopwatch;
    this._speed_bar_speed = 3;

    this._add_stopwatch(display)
    this._setup_interface();
  }

  speed_bar.prototype._add_stopwatch = function(display){
    this._stopwatch = DEFACE.stopwatch(display);
  }


  speed_bar.prototype._setup_interface = function(){
    var t = this;

    $(this.$trigger).on('touchstart', function(e){
      t.pause();
      e.preventDefault();
      return false;
    })

    $(this.$trigger).on('touchend', function(e){
      e.preventDefault();
      t.resume();
      return false;
    })

    $(this.$trigger).on('mousedown', function(e){
      if(e.which!=1){
        // if not primary mouse button
        return true;
      }
      e.preventDefault();
      t.pause();
      //return false;
    })
    $(this.$trigger).on('mouseup', function(e){
      e.preventDefault();
      t.resume();
      //return false;
    })
  },


  speed_bar.prototype._remove_speed_bar = function(){
    clearInterval(this._timer);
    this.$speed_bar.css({'width':'0px'})
  },

  speed_bar.prototype._add_speed_bar = function(interval){
    var t = this;
    var milliseconds = 10;
    this._timer = setInterval(function(){
      var w = t.$speed_bar.width() + t._speed_bar_speed;
      t.$speed_bar.css({'width':w+'px'})
    },milliseconds)
  }

  speed_bar.prototype.pause = function(){
    this._stopwatch.reset();
    this._stopwatch.start();
    this._add_speed_bar();
    this.trigger('pause');
  }

  speed_bar.prototype.resume = function(){
    this._stopwatch.stop();
    var time_elapsed = this._stopwatch.time_elapsed();

    //
    this._speed = time_elapsed;
    console.log(time_elapsed);
    this._timer_start = false;
    this._remove_speed_bar();
    this.trigger('resume', this._speed);
  }

})()