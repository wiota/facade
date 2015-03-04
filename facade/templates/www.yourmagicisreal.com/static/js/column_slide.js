var columnSlide = (function(t,l,r){

  // Private
  // get these from original css
  var top = t;
  var left = l;
  var right = r;
  var column = 100 - (l+r);

  var draw_column = function(){
    $('.projects .column1').css({
      'width':column+'%',
      'margin': top + '%' + right + '%' + top + '%' + left + '%'
    });
  }

  var move_column = function(l){
    left = l;
    right = 100 - (left + column);
    draw_column();
  }

  var size_column_left = function(l){
    left = l;
    column = 100 - (left + right);
    draw_column();
  }

  var size_column = function(r){
    column = (r - left)
    right = 100 - (left + column);
    draw_column();
  }

  var add_pill_el = function(cls, place){
    return dragger = $('<a class="'+cls+' phil_box"></a>').appendTo($(place))
  }

  var add_pill = function(side, cls, column, fn){
    var pill = add_pill_el(cls, column);
    pill.mousedown(function(e){

      if(e.which!=1){
        // if not primary mouse button
        return true;
      }

      // what is difference between where we clicked in the element
      // and the center of the element
      var w = $(document).width();
      var elClick = e.offsetX;
      var elPos = $(e.target).position().left;
      var elWid = $(column).width();

      if(side=='left'){
        var o = elClick+elPos
      } else if (side=='right'){
        var o = elClick+elPos-elWid;
      }

      $(document).mousemove(function(e){
        l = e.pageX - o;
        var amnt = (l/w)*100;
        fn(amnt);
        pill.html('<b class="label_above no_select">'+Math.ceil(amnt)+'%</b>')
      })

      $(document).mouseup(function(e){
        pill.html('');
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
      })
      return false;
    })
  }

  // Public

  function init(){
    //this.add_dragger();
    //this.add_sizer();
    add_pill('left','dragger', '.projects .column1', size_column_left);
    add_pill('right','sizer', '.projects .column1', size_column);
    draw_column();
  }


  init.prototype.add_hider = function(){
    var sizer = $('<a class="hider hide_box"></a>').appendTo($('body'))
    sizer.click(function(e){
      $('.phil_box').fadeToggle();
      $(this).show();
      return false;
    })
  }

  return new init();
})