var classToggle = (function(cls, selector, trigger){
  var baseCss = {};
  var $images = null;

  var toggleShow = function(img){
    img.toggleClass(cls);
  }

  function init(selector){
    var t = this;
    $images = $(trigger).on("click", function(){
      toggleShow($(selector));
    });
  }

  // needs insurance against other event handlers
  init.prototype.off = function(){
    $images.off("click");
  }

  return new init(selector);
})
