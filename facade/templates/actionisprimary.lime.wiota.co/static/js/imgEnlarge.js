function renderImg(src){
  return $("<div class='enlarged'><img src='"+src+"' /></div>")
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

function place(src, parent){
  var offset = $(window).scrollTop();
  var backdrop = mount(renderBackdrop(), parent);
  var img = mount(renderImg(src), parent);

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

function enlarger(el, parent){
  var element = $(el);
  var parent = $(parent);
  var src = element.data('large-img');
  var fn = place.bind(null, src, parent)
  element.on('click', fn)
}


$(document).ready( function () {
  $('.dance .content .image').each(function () {
    enlarger(this, 'body');
  });
})

