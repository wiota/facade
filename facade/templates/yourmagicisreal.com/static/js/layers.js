(function(){

  // layers -----------------------------------------------------------
  var layer = this.layer = function(){
    this.init.apply(this, arguments);
  }

  _.extend(layer.prototype, {

    init: function(layer){
      this.layer = $(layer);
      var t = this;
      $(window).on('scroll', t.adjust.bind(t))
    },

    calculate_speed: function(){
      var wh = $(document).outerHeight();
      var lh = this.layer.outerHeight();
      return lh/wh;
    },

    adjust: function(){
      this.speed = this.calculate_speed();

      adjust = $(window).scrollTop()*this.speed;

      // this.layer.css({'top': -adjust+'px'})
      this.layer.css({'transform': 'translate(0px,'+(-adjust)+'px)'})

    }
  })


})();


