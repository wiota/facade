(function(){

  // layers -----------------------------------------------------------
  var layer = this.layer = function(){
    this.init.apply(this, arguments);
  }

  _.extend(layer.prototype, {

    init: function(layer,speed){
      this.layer = $(layer);
      this.layer.css({'position':'absolute'})

      if(speed=='auto'){
        this.speed = this.calculate_speed();
      } else {
        this.speed = speed;
      }

      var t = this;
      $(window).on('scroll', t.adjust.bind(t))
    },

    calculate_speed: function(){
      return 1;

    },

    adjust: function(){
      adjust = $(window).scrollTop()*this.speed;
      // this.layer.css({'top': -adjust+'px'})
      this.layer.css({'transform': 'translate(0px,'+(-adjust)+'px)'}) 
      
    }
  })


})();


