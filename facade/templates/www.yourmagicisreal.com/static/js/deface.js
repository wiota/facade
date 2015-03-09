(function(root){
  var DEFACE = root.DEFACE = {}

  DEFACE.create = function(name, fn){
    if(this[name]){
      throw "Duplicate plug-in";
    }

    var fn = function(){}

    this[name] = function(){
      var inst = new fn();
      inst.init.apply(inst, arguments);
      return inst;
    };

    return fn;
  }

})(this);