var classToggle = (function(cls, selector){
  var baseCss = {};
  var $images = null;

  var toggleShow = function(img){
    img.toggleClass(cls);
  }

  function init(selector){
    var t = this;
    $images = $(selector).on("click", function(){
      toggleShow($(this));
    });
  }

  // needs insurance against other event handlers
  init.prototype.off = function(){
    $images.off("click");
  }

  return new init(selector);
})