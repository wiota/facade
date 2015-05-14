(function (){
  // requires jquery, underscore
  var column_slide = DEFACE.create('column_slide');

  column_slide.prototype.init = function(column, t,l,r){
    this.$column = $(column);

    // get these from original css
    this.top = t;
    this.left = l;
    this.right = r;
    this.column = 100 - (l+r);

    this.add_handle('left','dragger', this.$column, this.size_column_left.bind(this));
    this.add_handle('right','sizer', this.$column, this.size_column.bind(this));
    this.draw_column();
  }

  // Private


  column_slide.prototype.draw_column = function(){
    this.$column.css({
      'width':this.column+'%',
      'margin': this.top + '%' + this.right + '%' + this.top + '%' + this.left + '%'
    });
  }

  column_slide.prototype.move_column = function(l){
    this.left = l;
    this.right = 100 - (this.left + this.column);
    this.draw_column();
  }

  column_slide.prototype.size_column_left = function(l){
    this.left = l;
    this.column = 100 - (this.left + this.right);
    this.draw_column();
  }

  column_slide.prototype.size_column = function(r){
    this.column = (r - this.left)
    this.right = 100 - (this.left + this.column);
    this.draw_column();
  }

  column_slide.prototype.add_handle_el = function(cls, place){
    return dragger = $('<a class="'+cls+' handle"></a>').appendTo($(place))
  }

  column_slide.prototype.add_handle = function(side, cls, column, fn){
    var pill = this.add_handle_el(cls, column);
    pill.mousedown(function(e){

      if(e.which!=1){
        // if not primary mouse button
        return true;
      }

      var w = $(document).width();
      var elClick = e.offsetX;
      var elPos = $(e.target).position().left;
      var elWid = $(column).width();

      if(side=='left'){
        var o = elClick+elPos
      } else if (side=='right'){
        var o = elClick+elPos-elWid;
      }

      $(document).on('mousemove.column_slide', function(e){
        l = e.pageX - o;
        var amnt = (l/w)*100;
        fn(amnt);
        pill.html('<b class="label_above no_select">'+Math.ceil(amnt)+'%</b>')
      })

      $(document).on('mouseup.column_slide',function(e){
        pill.html('');
        $(document).off('mousemove.column_slide');
        $(document).off('mouseup.column_slide');
      })
      return false;
    })
  }

})();