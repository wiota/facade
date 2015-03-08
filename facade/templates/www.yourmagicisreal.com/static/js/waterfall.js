(function(){

  // Air elements

  add_air_elements = function(){
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

  }

  add_air_element = function(){
    var air_element = $('<div></div>');
    var padding_bottom = (Math.floor(Math.random()*30)+15);
    air_element.css({'padding-bottom':padding_bottom+"%",'float':'right'})
    air_element.addClass(this.item_class);
    air_element.prependTo(this.frame);
    this.items.unshift(air_element);
    this.queue_element(air_element);
  }

  // stopwatch --------------------------------------

  message_display = function(message){
    this.speed_text.text(message);
  }

  speed_display = function(milliseconds){
    var seconds = Math.floor(milliseconds/100)/10;
    this.message_display(this.speed_message+seconds+this.speed_units);
    return seconds;
  }

  // speed set --------------------------------------

  var speed_bar
  // speed bar indicator
    this.speed_bar_timer = null;
    this.speed_message = '';
    this.speed_units = '';
    this.speed_bar_speed = 3;

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
  },

  remove_speed_bar = function(){
    clearInterval(this.speed_bar_timer)
    this.speed_bar.css({'width':'0px'})
  },

  init_new_timer = function(interval){
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

  }

  pause = function(){
    clearInterval(this.timer);
    this.clean_queue()
    this.timer_start = new Date();
    this.init_new_timer();
  }

  resume = function(){
    if(!this.timer_start){
      return false;
    }
    this.timer_end = new Date();
    this.speed = (this.timer_end - this.timer_start)/this.speed_control_ratio;
    this.timer_start = null;
    this.start_cycle();
    this.remove_speed_bar();
  }

});

// --------------------------------------------------------

var waterfall = function (container){
  // requires jquery, underscore

  // Private ----------------------------------------------
  var container = $(container);
  var items = container.children();

  // variables - possibly set upon init
  var speed = 100;
  var fall_length = 10;
  var scrub_position = -1; // before start

  // counts
  var item_count = items.length;
  var frame_count = item_count + fall_length;

  // caching
  var cache = {}
  cache.showing = [];

  var item_class = items.first().attr('class');

  var timer = null;

  // img loading
  var loaded_count = 0;
  var load_start_time = null;
  var play_as_loaded = true;

  // Private functions --------------------------------------

  var init_images = function(){
    stash = items;
    items = [];
    //this.set_loading_bar(0);

    start_load();
    for (var _i=0; _i<stash.length; _i++) {
      $el = $(stash[_i]);
      $el.remove();
      $el.hide();
      append_on_load($el);
    };
  }

  var append_on_load = function($el){
    $el.find('img').load(function(){
      var loaded_count = items.push($el);
      $el.prependTo(container); // attach in reverse order
      if(play_as_loaded){
        next();
      }
      /*
      if(check_index(scrub_position, loaded_count)){
        $el.show();
        cache.showing.push(loaded_count);
      }
      */
      if(loaded_count === item_count){
        end_load();
        if(play_as_loaded){
          start();
        }
      }
    });
  }

  var start_load = function(){
    load_start_time = new Date(); // Cache buster of sorts
  }

  var end_load = function(){
    console.log(new Date() - load_start_time);
  }

  var check_index = function(timecode, index){
    if(index > (timecode-fall_length) && index <= timecode){
      return true;
    } else{
      return false;
    }
  }

  var generate_show_list = function(timecode){
    showlist = [];
    for (var i = timecode-fall_length+1; i <= timecode; i++){
      if(i>=0 && i<item_count){
        showlist.push(i);
      }
    }
    return showlist;
  }

  var hide_by_index = function(i){
    items[i].hide();
  }

  var show_by_index = function(i){
    if(items[i]){
      items[i].show();
    } else {
      cache.showing = _.without(cache.showing, i)
    }
  }

  var render = function(list){
    // underscore dependancy
    var to_show = _.difference(list, cache.showing);
    var to_hide = _.difference(cache.showing, list);
    cache.showing = list;
    _.each(to_hide, hide_by_index);
    _.each(to_show, show_by_index);
  }

  var scrub = function(timecode){
    scrub_position = timecode;
    if(!load_start_time){
      return false;
    }
    var list = generate_show_list(timecode);
    render(list);
  }

  // Public ----------------------------------------------

  function init(){
    init_images();

  }

  init.prototype.set_speed = function(s){
    speed = s<50 ? 50 : s;
  }

  var start = init.prototype.start = function(){
    timer = setInterval(next, speed);
  }

  var stop = init.prototype.stop = function(){
    play_as_loaded = false;
    clearInterval(timer);
  }

  var next = init.prototype.next = function(){
    scrub_position++;
    if(scrub_position >= frame_count){
      scrub_position = -1;
      stop();
    }
    scrub(scrub_position);
  }

  var prev = init.prototype.previous = function(){
    scrub_position--;
    if(scrub_position < 0){
      scrub_position = -1;
      stop();
    }
    scrub(scrub_position);
  }

  init.prototype.scrub = function(timecode){
    stop();
    scrub(timecode);
  }

  init.prototype.scrub_percent = function(percent){
    stop();
    number = percent >= 100 ? frame_count-1 : Math.floor(percent*frame_count/100);
    return scrub(number);
  }

  init.prototype.playhead = function(){
    return scrub_position;
  }

  init.prototype.playhead_percent = function(){
    return scrub_position/frame_count*100;
  }


  return new init();

}
