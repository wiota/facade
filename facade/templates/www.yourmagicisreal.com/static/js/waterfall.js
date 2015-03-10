// --------------------------------------------------------

(function (){
  // requires jquery, underscore
  var waterfall = DEFACE.create('waterfall');

  // Private ----------------------------------------------
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


  // Private functions --------------------------------------

  waterfall.prototype._init_images = function(){
    var stash = this._items;
    this._items = [];
    //this.set_loading_bar(0);

    this._start_load();
    for (var _i=0, _len=stash.length; _i<_len; _i++) {
      $el = $(stash[_i]);
      $el.remove();
      $el.hide();
      this._append_on_load($el);
    };
  }

  waterfall.prototype._append_on_load = function($el){
    var instance = this;
    $el.find('img').load(function(){
      var loaded_count = instance._items.push($el);
      $el.prependTo(instance.container); // attach in reverse order
      if(instance._play_as_loaded){
        instance.next();
      }
      /*
      if(_check_index(scrub_position, loaded_count)){
        $el.show();
        cache.showing.push(loaded_count);
      }
      */
      if(loaded_count === instance._item_count){
        instance._end_load();
        if(instance._play_as_loaded){
          instance.start();
        }
      }
    });
  }

  waterfall.prototype._start_load = function(){
    this._load_start_time = new Date(); // Cache buster of sorts
  }

  waterfall.prototype._end_load = function(){
    this._loaded = true;
    console.log(new Date() - this._load_start_time);
  }

  waterfall.prototype._check_index = function(timecode, index){
    if(index > (timecode-this._fall_length) && index <= timecode){
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
    this._items[i].hide();
  }

  waterfall.prototype._show_by_index = function(i){
    if(this._items[i]){
      this._items[i].show();
    } else {
      // remove
      this._showing = _.without(cache.showing, i)
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
    this._scrub_position = timecode;
    if(!this._load_start_time){
      return false;
    }
    var list = this._generate_show_list(timecode);
    this.render(list);
  }

  // Public ----------------------------------------------

  waterfall.prototype.set_speed = function(s){
    this._speed = s<50 ? 50 : s;
  }

  waterfall.prototype.start = function(){
    var instance = this;
    this._timer = setInterval(function(){
      instance.next();
    }, this._speed);
  }

  waterfall.prototype.stop = function(){
    this._play_as_loaded = false;
    clearInterval(this._timer);
  }

  waterfall.prototype.next = function(){
    this._scrub_position++;
    if(this._scrub_position >= this._frame_count){
      this._scrub_position = -1;
      this.stop();
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

})()
