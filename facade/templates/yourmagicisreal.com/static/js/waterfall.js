// --------------------------------------------------------

(function (){
  // requires jquery, underscore
  var waterfall = DEFACE.create('waterfall');

  waterfall.prototype.init = function(container, speed, len){
    this.container = $(container);
    this._items = this.container.children();

    this._speed = speed || 100;
    this._fall_length = len || 10;
    this._scrub_position = -1; // before start

    // counts
    this._item_count = this._items.length;
    this._frame_count = this._item_count + this._fall_length;

    // cache showing
    this._showing = [];

    this._item_class = this._items.first().attr('class');

    this._timer = null;

    // img loading
    this._loaded = false;
    this._load_start_time = null;
    this._play_as_loaded = true;

    this._init_images();
  }

  waterfall.prototype._init_images = function(){
    var stash = this._items;
    this._items = [];
    //this.set_loading_bar(0);

    this._start_load();
    var complete = [];

    var _len = stash.length;

    for (var _i=0; _i<_len; _i++) {
      $el = $(stash[_i]);
      $el.addClass('hide');
      $el.remove();

      // parse based on complete
      var img = $el.find('img');

      if(img[0].complete){
        complete.push($el);
      } else {
        img.one('load', this._load_handler.bind(this, $el));
      }

    };

    if(complete.length === _len){
      console.log('autostart ' + complete.length);
      this.stop();
      $.each(complete, this.trigger_load.bind(this));
      this.rewind();
      this.start();
    } else {
      $.each(complete, this.trigger_load.bind(this))
    }
  }

  waterfall.prototype.trigger_load = function(index, $el){
    this._load_handler($el);
  }

  waterfall.prototype._load_handler = function($el){
    var loaded_count = this._items.push($el);
    var el_index = loaded_count-1;

    // progress
    var progress = loaded_count/(this._item_count+this._fall_length)*100;
    this.trigger('load_progress', progress);

    // for testing
    //$el.append("<div class='order'>"+(el_index)+"</div>")
    $el.prependTo(this.container); // attach in reverse order

    if(this._play_as_loaded){
      this.next();
    }

    if(this._check_index(el_index)){
      this._show_by_index(el_index);
    }

    if(loaded_count === this._item_count){
      this._end_load();
    }
  }

  waterfall.prototype._show_single_image = function(index){
    this.stop();
    this.render(index);
  }

  waterfall.prototype._start_load = function(){}

  waterfall.prototype._end_load = function(){
    console.log('end load');
    console.log(this._play_as_loaded);

    this._loaded = true;
    if(this._play_as_loaded){
      this.start();
    }
    this.trigger('load_progress', 100);
    this.trigger('load');
  }

  waterfall.prototype._check_index = function(index){
    start = this._scrub_position;
    end = start - this._fall_length;
    if(index <= start && index > end){
      return true;
    } else{
      return false;
    }
  }

  waterfall.prototype._generate_show_list = function(timecode){
    showlist = [];
    for (var i = timecode-this._fall_length+1; i <= timecode; i++){
      if(i>=0 && i<this._item_count){
        showlist.push(i);
      }
    }
    return showlist;
  }

  waterfall.prototype._hide_by_index = function(i){
    if(this._items[i]){
      this._items[i].addClass('hide');
    }
  }

  waterfall.prototype._show_by_index = function(i){
    if(this._items[i]){
      this._items[i].removeClass('hide');
    }
  }

  waterfall.prototype.render = function(list){
    // underscore dependancy
    var to_show = _.difference(list, this._showing);
    var to_hide = _.difference(this._showing, list);
    this._showing = list;
    _.each(to_hide, this._hide_by_index, this);
    _.each(to_show, this._show_by_index, this);
  }

  waterfall.prototype._scrub = function(timecode){
    var list = this._generate_show_list(timecode);
    this._scrub_position = timecode;
    this.render(list);
    this.trigger('scrub', this.playhead_percent())
  }

  waterfall.prototype.set_speed = function(s){
    this._speed = s<50 ? 50 : s;
  }

  waterfall.prototype.start = function(){
    var instance = this;
    clearInterval(this._timer);
    if(!this._loaded){
      this._play_as_loaded = true;
    } else {
      this._timer = setInterval(function(){
        instance.next();
      }, this._speed);
    }
    this.trigger('start');
  }

  waterfall.prototype.stop = function(){
    this._play_as_loaded = false;
    clearInterval(this._timer);
    this.trigger('stop');
  }

  waterfall.prototype.rewind = function(){
    this.stop();
    this._scrub(-1);
  }

  waterfall.prototype.next = function(){
    this._scrub_position++;
    if(this._scrub_position >= this._frame_count){
      this.rewind();
    }
    this._scrub(this._scrub_position);
  }

  waterfall.prototype.previous = function(){
    this._scrub_position--;
    if(this._scrub_position < 0){
      this._scrub_position = -1;
      this.stop();
    }
    this._scrub(this._scrub_position);
  }

  waterfall.prototype.scrub = function(timecode){
    this.stop();
    this._scrub(timecode);
  }

  waterfall.prototype.scrub_percent = function(percent){
    this.stop();
    var timecode = percent >= 100 ? this._frame_count-1 : Math.floor(percent*this._frame_count/100);
    return this._scrub(timecode);
  }

  waterfall.prototype.playhead = function(){
    return this._scrub_position;
  }

  waterfall.prototype.playhead_percent = function(){
    return this._scrub_position/this._frame_count*100;
  }

  waterfall.prototype.complete = function(){
    return this._loaded;
  }

})()
