(function(frame, items, trigger, speed, center){

  var rapidfire = this.rapidfire = function(){
    this.init.apply(this, arguments);
  }

  _.extend(rapidfire.prototype, {

    init: function(frame, items, trigger, speed, center){
      // items
      this.items = $(items);
      this.frame = $(frame);
      this.trigger = $(trigger);
      this.center = center || false;
      this.current_image = 0;

      this.loaded = 0;
      this.LENGTH = this.items.length;

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

      //this.setup_interface();
      this.setup_display();
      this.load_images();
    },

    load_images: function(){
      var img_new_order = [];
      var t = this;
      var timestart = new Date(); // Cache buster of sorts
      t.set_loading_bar(0);
      _.each(this.items, function(item){
        var $i = $(item);
        $i.remove();
        $i.find('img').load(function(){
          var index = t.loaded++;
          img_new_order[index] = $i;
          $i.prependTo(t.frame);
          $i.show();
          if(index>0){
            img_new_order[index-1].hide();
          }

          t.set_loading_bar(index*100/t.LENGTH);
          if(t.loaded == t.LENGTH){
            var totaltime = new Date() - timestart;
            console.log('loaded');
            img_new_order[index].hide();
            t.items = img_new_order;
            t.center_images();
            t.setup_interface();
            if(totaltime<(1000)){
              t.start_cycle();
            }
            t.message_display(' ');
          }
        });
      })
      this.items.hide();
    },

    center_images: function(){
      if(!this.center){
        return false;
      }
      // this function is designed to center images
      var t = this;
      var docwidth = $(document).width();
      var docheight = $(document).height();
      _.each(this.items, function(item){
        item = $(item);
        // set placement based on document
        var h_space = docwidth - item.width();
        var v_space = docheight - item.height();

        var css = {
          'position':'absolute',
          'top': v_space/2,
          'left': h_space/2,
          'z-index':3
        }

        item.css(css);

      })
    },

    setup_interface: function(){
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

    setup_display: function(){
      this.speed_bar = $('.speed_bar');
      this.speed_bar.css({
        'display':'block',
        'position':'absolute',
        'left':'0',
        'top':'0',
        'bottom':'0'
      })

      this.speed_text = $('.speed_text');

      var css = {
        'position':'absolute',
        'top': 0,
        'left': 0,
        'right': 0,
        'z-index':3
      }

      this.loading = $('.rapidfire_load');
      this.loading_bar = $('.rapidfire_load_bar');
    },

    init_new_timer: function(interval){
      var t = this;

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

    set_loading_bar: function(percent){
      this.loading_bar.width(percent+"%");
    },

    remove_speed_bar: function(){
      clearInterval(this.speed_bar_timer)
      this.speed_bar.css({'width':'0px'})
    },

    speed_display: function(milliseconds){
      var seconds = Math.floor(milliseconds/100)/10;
      this.message_display(this.speed_message+seconds+this.speed_units);
      return seconds;
    },

    message_display: function(message){
      this.speed_text.text(message);
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
      this.start_cycle();
      this.remove_speed_bar();
    },

    start_cycle: function(){
      $(this.items[this.current_image]).show();
      this.timer = setInterval(this.step.bind(this), this.speed);
    },

    iterate: function(){
      if(this.current_image >= this.LENGTH && this.loop > 0) {
        this.current_image = 0;
        this.loop--;
      } else if(this.current_image >= this.LENGTH && this.loop === 0) {
        return false;
      } else {
        this.current_image++;
      }
      return true;
    },

    step: function(){

      // hide current image
      $(this.items[this.current_image]).hide();

      // iterate
      if(this.iterate()){
        $(this.items[this.current_image]).show();
      } else {
        clearInterval(this.timer);
        this.current_image = 0;
        this.message_display(' ');
        return false;
      }


    }

  })

})();

