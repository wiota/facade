(function(){

  // openable -----------------------------------------------------------
  var openable = this.openable = function(){
    this.init.apply(this, arguments);
  }

  var menu_items;
  var display_items;

  _.extend(openable.prototype, {

    init: function(){

      // items
      menu_items = $('.show');

      menu_items.click(this.show);

      $('.display_close').click(this.hide);
    },


    show: function(){

      var top = $(window).scrollTop();
      var mi = $(this);
      var id = mi.attr('rel').slice(5);
      $('.display_close').fadeIn();
      $('.subnav').fadeOut();
      $('.column1').addClass('single');
      $('#display_'+id).addClass('open');
      $('#display_'+id+' .additional').css({'position':'absolute', 'left':'2%', 'right': '2%', 'top': top})

    },

    hide: function(){
      $('.display_close').fadeOut();
      $('.subnav').fadeIn();
      $('.column1').removeClass('single');
      $('.project_block').removeClass('open');

    }



  })

})();

