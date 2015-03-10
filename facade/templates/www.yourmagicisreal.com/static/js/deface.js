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

  // Events
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

  // bind polyfill - bind used heavily with event handlers
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }


})(this);