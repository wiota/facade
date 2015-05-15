
(function(){

  // requires jquery.transform.js

  // title_slide -----------------------------------------------------------
  var title_slide = this.title_slide = function(){
    this.init.apply(this, arguments);
  }

  _.extend(title_slide.prototype, {

    init: function(title, threshold, speed, start, end){
      this.title = $(title);
      this.speed = speed;
      this.threshold = threshold || 2;
      this.hidden = false;
      this.start = start;
      this.end = end;

      this.check_interval = 250;
      this.status = 0;
      
      this.transition(this.start);
      
      var t = this;
      $(window).on('scroll', t.set_status.bind(t))
      //this.title.on('click', t.force.bind(t))
      

      setInterval(this.check_status.bind(t), t.check_interval)


    },

    init_transition: function(){

    },

    transition: function(place){
      //this.title.animate({'top': (-place)});
      
      this.title.css({'transform': 'translate(0px,'+(place)+') rotate(-30deg) translateZ(0)' });
      /*
      if(place==this.start){
        this.title.removeClass('translator');  
      } else {
        this.title.addClass('translator');
      }
      */
      //this.title.css({'transform': 'translateZ(0)'})
    },

    set_status: function(){
      if($(document).scrollTop()>this.threshold){
        this.status = 1;
        //console.log(this.status);
      } else {
        this.status = 0;
        //console.log(this.status);
      }
    },

    check_status: function(){
      if(this.status == 1 && !this.hidden){
        console.log('END');
        this.hidden = true;
        this.transition(this.end);
      } else if (this.status == 0 && this.hidden) {
        console.log('START');
        this.hidden = false;
        this.transition(this.start);
      }
    },

    force: function(){
      if($(document).scrollTop()<this.threshold){
         $(document).scrollTop(this.threshold+1);
         //alert(this.threshold+this.distance)
         this.check();
      }

    }

  })

})();

