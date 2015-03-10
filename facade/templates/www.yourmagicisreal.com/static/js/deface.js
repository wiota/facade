(function(root){
  var DEFACE = root.DEFACE = {}

  DEFACE.create = function(name){
    if(this[name]){
      throw "Duplicate plug-in";
    }

    var fn = function(){}
    $.extend(fn.prototype, events);

    this[name] = function(){
      var inst = new fn();
      inst.init.apply(inst, arguments);
      return inst;
    };

    return fn;
  }

  var events = {
    // The trigger event must be augmented separately because it requires a
    // new Event to prevent unexpected triggering of a method (and possibly
    // infinite recursion) when the event type matches the method name
    trigger: function (type, data) {
      var event = new $.Event(type);
      event.preventDefault();
      $.event.trigger(event, data, this);
      return this;
    }
  };

  // Augment the object with jQuery's event methods
  $.each(['one', 'on', 'off'], function (i, method) {
    events[method] = function (type, data, fn) {
      $(this)[method](type, data, fn);
      return this;
    };
  });


})(this);