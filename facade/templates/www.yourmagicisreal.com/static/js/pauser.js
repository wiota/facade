
(function(){

  // pauser -----------------------------------------------------------
  var pauser = this.pauser = function(){
    this.init.apply(this, arguments);
  }

  _.extend(pauser.prototype, {

    init: function(items, speed){
      // items
      this.items = $(items);
      this.highlighted = null;
      this.current_image = 0;
      this.loaded = 0;

      // flip variables
      this.speed = speed;
      this.speed_control_ratio=2;
      this.timer_start = 0;
      this.timer_end = 0;
      this.timer = null;

      // speed bar indicator
      this.speed_bar = null;
      this.speed_bar_timer = null;
      this.speed_message = '';
      this.speed_units = '';
      this.speed_bar_speed = 3;

      var t = this;

      this.load_images();

    },

    load_images: function(){
      var t = this;
      _.each(this.items, function(item){
        $(item).css({
          'position':'absolute',
          'display':'none'
        })
        $(item).find('img').load(function(){
          t.loaded += 1;
          if(t.loaded == t.items.length){
            t.center_images();
            t.setup_interface();
            t.cycle_once();
            t.message_display(' ');
          }
        });

      })
      this.items.hide();
    },

    center_images: function(){
      // this function is designed to center images
      var t = this;
      var docwidth = $(document).width();
      var docheight = $(document).height();
      _.each(this.items, function(item){
        item = $(item);

        // set placement based on document
        var h_space = docwidth - item.width();
        var v_space = docheight - item.height();

        // set placement based on parent
        // if parent is not full height of page, this poses a problem
        //var h_space = item.parent().width() - item.width();
        //var v_space = item.parent().height() - item.height();

        //var top = v_space*Math.random();
        //var left = h_space*Math.random();
        var top = v_space/2;
        var left = h_space/2;

        //console.log(top + " " + left)

        item.css({
          'position':'absolute',
          'top': top,
          'left': left,
          'z-index':3
        })
      })
    },

    setup_interface: function(){
      var t = this;

      $('.frame').on('touchstart', function(e){
        t.pause();
        e.preventDefault();
        return false;
      })

      $('.frame').on('touchend', function(e){
        e.preventDefault();
        t.resume();
        return false;
      })

      $('.frame').on('mousedown', function(e){
        if(e.which!=1){
          // if not primary mouse button
          return true;
        }
        e.preventDefault();
        t.pause();
        //return false;
      })
      $('.frame').on('mouseup', function(e){
        e.preventDefault();
        t.resume();
        //return false;
      })
      $(window).resize(function(){
        t.center_images();
      })

    },

    init_new_timer: function(){
      var t = this;
      this.speed_bar = $('<div class="speed_bar"></div>').appendTo('body');
      this.speed_bar.css({
        'display':'block',
        'position':'absolute',
        'left':'0',
        'top':'0',
        'bottom':'0',
        'z-index':'15'
      })

      t.speed_display(10);

      this.speed_bar_timer = setInterval(function(){
        var w = t.speed_bar.width()+t.speed_bar_speed;
        t.speed_bar.css({'width':w+'px'})
        var seconds = t.speed_display((new Date() - t.timer_start)/t.speed_control_ratio);

        if(seconds >= 3){
          t.resume();
        }
      },10)

    },

    remove_speed_bar: function(){
      clearInterval(this.speed_bar_timer)
      this.speed_bar.remove();
    },

    speed_display: function(milliseconds){
      var seconds = Math.floor(milliseconds/100)/10;
      $('.speed_display').text(this.speed_message+seconds+this.speed_units);
      return seconds;
    },

    message_display: function(message){
      $('.speed_display').text(message);
    },

    pause: function(){
      clearInterval(this.timer);
      this.timer_start = new Date();
      this.init_new_timer();
    },

    resume: function(){
      if(!this.timer_start){
        return false;
      }
      this.timer_end = new Date();
      this.speed = (this.timer_end - this.timer_start)/this.speed_control_ratio;
      this.timer_start = null;
      this.cycle_once();
      this.remove_speed_bar();
    },

    loop_through_next_image: function(){


      $(this.items[this.current_image]).hide();

      if(++this.current_image > this.items.length-1){
        this.current_image = 0;
      }

      $(this.items[this.current_image]).show();

      // cycling

    },

    cycle: function(){
      var t = this;

      // set display
      t.speed_display(t.speed);

      // first image
      this.loop_through_next_image();

      // timer
      this.timer = setInterval(this.loop_through_next_image.bind(this), this.speed)

    },

    cycle_once: function(){

      var t = this;

      $(this.items[this.current_image]).show();

      // timer
      this.timer = setInterval(this.step_through_next_image.bind(this), this.speed);

    },


    step_through_next_image: function(){

      console.log(this.current_image);
      $(this.items[this.current_image]).hide();

      if(this.current_image++ > this.items.length-1){
        clearInterval(this.timer);
        this.current_image = 0;

        return false;
      }

      // cycling
      $(this.items[this.current_image]).show();


    }

  })

})();

