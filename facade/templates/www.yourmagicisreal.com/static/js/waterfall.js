(function(frame, items, trigger, speed, center){

  var waterfall = this.waterfall = function(){
    this.init.apply(this, arguments);
  }

  _.extend(waterfall.prototype, {

    init: function(frame, items, trigger, speed, trail){
      // items
      this.items = $(items);
      this.item_class = this.items.first().attr('class');
      this.frame = $(frame);
      this.trigger = $(trigger);
      this.current_image = 0;
      this.center = center || false;
      this.loaded = 0;
      this.loop = 0;
      this.LENGTH = this.items.length;

      this.queue = [];
      this.trail = trail || 20;

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
      this.init_images();
    },

    init_images: function(){
      var items = this.items;
      var t = this;
      var timestart = new Date(); // Cache buster of sorts

      this.items = []
      this.set_loading_bar(0);

      _.each(items, function(item){
        var $i = $(item);
        $i.remove();

        $i.find('img').load(function(){
          var index;

          $i.prependTo(t.frame);
          t.items.unshift($i);
          t.queue_element($i);

          index = ++t.loaded;
          t.set_loading_bar(index*100/t.LENGTH);
          if(index === t.LENGTH){
            if(new Date() - timestart<=1000){
              t.start_cycle();
            }
            //t.add_air_elements();
            t.clean_queue();
            t.setup_interface();
            t.message_display(' ');
          }
        });
      })

    },

    add_air_elements: function(){
      var airId;
      var t = this;
      var remaining = this.trail;

      airId = setInterval(function(){
        if(remaining<=0){
          console.log('airfall');
          t.clean_queue();
          clearInterval(airId);
        } else {
          t.add_air_element();
          remaining--;
          console.log('still airing out')
        }
      }, 50);

    },

    add_air_element: function(){
      var air_element = $('<div></div>');
      var padding_bottom = (Math.floor(Math.random()*30)+15);
      air_element.css({'padding-bottom':padding_bottom+"%",'float':'right'})
      air_element.addClass(this.item_class);
      air_element.prependTo(this.frame);
      this.items.unshift(air_element);
      this.queue_element(air_element);
    },

    queue_element: function($el){
      if(!$el.show){
        return false;
      }
      this.queue.unshift($el);
      $el.show();
      if(this.queue.length > this.trail){
        this.dequeue_element()
      }
    },

    dequeue_element: function(){
      if(this.queue.length > 0){
        this.queue.pop().hide();
      }
    },

    clean_queue: function(){
      var cleanId;
      var t = this;
      var remaining = t.queue.length;
      console.log("cleaning "+ remaining);
      // clean queue on a timer
      cleanId = setInterval(function(){
        if(remaining<=0){
          console.log('cleaned');
          clearInterval(cleanId);
        } else {
          t.dequeue_element();
          remaining--;
          console.log('still cleaning')
        }
      }, this.speed);
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

      this.loading = $('.waterfall_load');
      this.loading_bar = $('.waterfall_load_bar');
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
      this.clean_queue()
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
      this.current_image = this.items.length-1;
      this.clean_queue();
      clearInterval(this.timer)
      this.timer = setInterval(this.step.bind(this), this.speed);
    },

    step: function(){
      this.queue_element(this.items[this.current_image]);
      this.current_image--;
      if(this.current_image <= 0){
        this.clean_queue();
        clearInterval(this.timer);
      }
    }

  })

})();

