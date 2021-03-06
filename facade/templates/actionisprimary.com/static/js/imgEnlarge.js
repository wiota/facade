var imageEnlarger = (function(){
  function renderImg(src, className){
    return $("<div class='"+className+"'><img src='"+src+"' /></div>")
  }

  function renderBackdrop(){
    return $("<div class='photo_backdrop'></div>")
  }

  function mount(node, parent){
    return node.appendTo(parent);
  }

  function toCssUnits(number, unit){
    unit = unit || 'px'
    return (
      parseInt(number)!==0 ?
        number+unit :
        "0"
    );
  }

  function place(src, parent, el){
    var screenRatio = $(window).width() / $(window).height();
    var imgRatio = el.width() / el.height();
    var offset = $(window).scrollTop();
    var backdrop = mount(renderBackdrop(), parent);
    if(screenRatio > imgRatio){
      var img = mount(renderImg(src, 'enlarged tall'), parent);
    } else {
      var img = mount(renderImg(src, 'enlarged'), parent);
    }

    function fn (){
      backdrop.remove();
      img.remove();
    }

    img.css({
      position: "absolute",
      top: toCssUnits(offset)
    })
    img.on('click', fn);
    backdrop.on('click', fn);
  }

  function pagePlace(parent, event){
    var element = $(event.target.parentNode);
    var parent = $(parent);
    var src = element.data('large-img');
    place(src, parent, element)
  }

  function pageEnlarge(selector, parent){
    $(selector).on('click', pagePlace.bind(null, parent));
  }

  return pageEnlarge;
})()

$(document).ready( function () {
  imageEnlarger('.dance .content .image', 'body')
})

