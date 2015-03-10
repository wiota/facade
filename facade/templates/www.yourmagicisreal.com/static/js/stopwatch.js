(function(){

  var stopwatch = DEFACE.create('stopwatch');

  stopwatch.prototype.init = function(display){
    this.$display = $(display);
    this._counter = 0;
    this._running = false;
    this._startTime = null;
    this._display_timer = null;
    this._update_display();
  }

  stopwatch.prototype._start_display_timer = function(){
    instance = this;
    this._display_timer = setInterval(function(){
      instance._update_display();
    }, 100);
  }

  stopwatch.prototype._stop_display_timer = function(){
    clearInterval(this._display_timer);
    this._update_display();
  }

  stopwatch.prototype._update_display = function(){
    this.$display.html(Math.floor(this.time_elapsed()/10)/100);
  }

  stopwatch.prototype.start = function(){
    this._startTime = new Date();
    this._start_display_timer();
    this._running = true;
    this.trigger('start');
  }

  stopwatch.prototype.time_elapsed = function(){
    if(this._running){
      return this._counter + (new Date()-this._startTime);
    } else {
      return this._counter;
    }
  }

  stopwatch.prototype.stop = function(){
    if(this._running){
      this._counter = this.time_elapsed();
      this._running = false;
      this.trigger('stop');
    }

    this._stop_display_timer();
    return this._counter;
  }

  stopwatch.prototype.reset = function(){
    if(this._running){
      return false;
    } else {
      this._counter = 0;
    }
    this._update_display();
  }

})();