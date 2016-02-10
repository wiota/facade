var videoEnlarger = (function(){
  function renderYoutube(src, className){
    return $("<div class='"+className+"'><iframe src='"+src+"' width='500' height='500' frameborder='0' allowfullscreen></iframe></div>");
  }

  function renderBackdrop(){
    return $("<div class='video_backdrop'></div>")
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

  function placeVid(src, parent, el){
    var screenRatio = $(window).width() / $(window).height();
    var imgRatio = 1;
    var offset = $(window).scrollTop();
    if(screenRatio > imgRatio){
      var iframe = mount(renderYoutube(src, 'video enlarged tall'), parent);
    } else {
      var iframe = mount(renderYoutube(src, 'video enlarged'), parent);
    }

    var backdrop = mount(renderBackdrop(), parent);

    function fn (){
      backdrop.remove();
      iframe.remove();
    }

    iframe.css({
      position: "absolute",
      top: toCssUnits(offset)
    })
    iframe.on('click', fn);
    backdrop.on('click', fn);
  }

  function pagePlace(parent, event){
    var target = $(event.target);
    if(target.hasClass('youtube')){
      console.log(target)
      var element = target;
    } else {
      var element = target.parents('.youtube.block');
    }
    var parent = $(parent);
    var src = element.data('embed-src');
    placeVid(src, parent, element)
  }

  function pageEnlarge(selector, parent){
    $(selector).on('click', pagePlace.bind(null, parent));
  }

  return pageEnlarge;
})()

$(document).ready( function () {
  videoEnlarger('.dance .content .youtube', 'body')
})

