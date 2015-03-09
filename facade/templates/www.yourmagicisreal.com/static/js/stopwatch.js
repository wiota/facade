(function(){

  var stopwatch = DEFACE.create('stopwatch');

  var $display = null;
  var counter = 0;
  var running = false;
  var startTime = null;

  var display_timer;

  var start_display_timer = function(){
    display_timer = setInterval(update_display, 100);
  }

  var stop_display_timer = function(){
    clearInterval(display_timer);
    update_display();
  }

  var update_display = function(){
    $display.html(Math.floor(time_elapsed()/10)/100);
  }

  stopwatch.prototype.init = function(display){
    $display = $(display);
    update_display();
  }

  stopwatch.prototype.start = function(){
    startTime = new Date();
    start_display_timer();
    running = true;
  }

  var time_elapsed = stopwatch.prototype.time_elapsed = function(){
    if(running){
      return counter + (new Date()-startTime);
    } else {
      return counter;
    }
  }

  stopwatch.prototype.stop = function(){
    if(running){
      counter = time_elapsed();
      running = false;
    }

    stop_display_timer();
    return counter;
  }

  stopwatch.prototype.reset = function(){
    if(running){
      return false;
    } else {
      counter = 0;
    }
    update_display();
  }

})();


(function(){

  // DEsign interFACE
  function stopwatch2(){};
  var stopwatch2 = DEFACE.create('stopwatch2', stopwatch2);

  var counter = 0;

  stopwatch2.prototype.init = function(display){
    counter++;
    console.log(this);
  }

  stopwatch2.prototype.count = function(){
    return counter;
    console.log(this);
  }

})();





