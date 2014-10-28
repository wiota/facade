(function(){

  // openable -----------------------------------------------------------
  var openable = this.openable = function(){
    this.init.apply(this, arguments);
  }

  var menu_items;
  var display_items;

  _.extend(openable.prototype, {

    init: function(m_i, d_i){

      // items
      menu_items = $(m_i);
      display_items = $(d_i);

      menu_items.click(this.show);

      $('.display_close').click(this.hide);
    },


    show: function(){
      var mi = $(this);
      var id = mi.attr('rel').slice(5);
      $('.display_close').fadeIn();
      $('.subnav').fadeOut();
      $('.column1').addClass('single');
      $('#display_'+id).addClass('open');
      //$('.project_block').css({'opacity': 0});
      //$('#display_'+id).css({'opacity':1})
      //$('#display_'+id+' .show').hide();
      //$('#display_'+id+' .hide').fadeIn();

    },

    hide: function(){
      $('.display_close').fadeOut();
      $('.subnav').fadeIn();
      $('.column1').removeClass('single');
      $('.project_block').removeClass('open');
      //$('.project_block').css({'opacity': 1});
      //$('.project_block .show').fadeIn();
      //$('.project_block .hide').hide();

    }



  })

})();

