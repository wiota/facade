
  // speed set --------------------------------------

  var speed_bar
  // speed bar indicator
    this._speed_bar_timer = null;
    this._speed_message = '';
    this._speed_units = '';
    this._speed_bar_speed = 3;

    //this.setup_interface();
    this.setup_display();

  setup_interface = function(){
    var t = this;

    $(this.trigger).on('touchstart', function(e){
      t.pause();
      e.preventDefault();
      return false;
    })

    $(this.trigger).on('touchend', function(e){
      e.preventDefault();
      t.resume();
      return false;
    })

    $(this.trigger).on('mousedown', function(e){
      if(e.which!=1){
        // if not primary mouse button
        return true;
      }
      e.preventDefault();
      t.pause();
      //return false;
    })
    $(this.trigger).on('mouseup', function(e){
      e.preventDefault();
      t.resume();
      //return false;
    })
  },

  setup_display = function(){
    this._speed_bar = $('.speed_bar');
    this._speed_bar.css({
      'display':'block',
      'position':'absolute',
      'left':'0',
      'top':'0',
      'bottom':'0'
    })

    this._speed_text = $('.speed_text');

    var css = {
      'position':'absolute',
      'top': 0,
      'left': 0,
      'right': 0,
      'z-index':3
      }
  },

  remove_speed_bar = function(){
    clearInterval(this._speed_bar_timer)
    this._speed_bar.css({'width':'0px'})
  },

  init_new_timer = function(interval){
    var t = this;

    t.speed_display(10);

    this._speed_bar_timer = setInterval(function(){
      var w = t.speed_bar.width()+t.speed_bar_speed;
      t.speed_bar.css({'width':w+'px'})
      var seconds = t.speed_display((new Date() - t.timer_start)/t.speed_control_ratio);

      if(seconds >= 3){
        t.resume();
      }
    },10)

  }

  pause = function(){
    clearInterval(this._timer);
    this.clean_queue()
    this._timer_start = new Date();
    this.init_new_timer();
  }

  resume = function(){
    if(!this._timer_start){
      return false;
    }
    this._timer_end = new Date();
    this._speed = (this._timer_end - this._timer_start)/this._speed_control_ratio;
    this._timer_start = null;
    this.start_cycle();
    this.remove_speed_bar();
  }