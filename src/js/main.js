(function($) {
  //noinspection JSAnnotator
  $.fn.pack = function(options) {
    var settings = $.extend({
        // margin: 10px;
      }, options );

    // this should be a container div with a series of img or figure children.
    $(this).children().each(function() {
        if ($(this).is("img")) {
          var img = this;
          $(this).wrap('<div />');
          var flexWrapper = $(this).parent();
        } else { // <figure> or <a>
          var img = $(this).find("img")[0];
          var flexWrapper = $(this)
        }
        var aspect = img.naturalWidth / img.naturalHeight;
        flexWrapper.css({ flex: aspect + "" });
      });

    return this;
    // });
  };

  var swiper = new Swiper('.swiper-container1', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#sbn',
      prevEl: '#sbp',
    }
  });
  
  var swiper2 = new Swiper('.swiper-container2', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#sbn2',
      prevEl: '#sbp2',
    }
  });

  var swiper3 = new Swiper('.swiper-containerNews', {
    slidesPerView: 'auto',
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '#sbn3',
      prevEl: '#sbp3',
    }
  });
})(jQuery);

$(window).on('load', function() {
  $("div.pack").pack();
});

window.FontAwesomeConfig = {
  searchPseudoElements: true
}

$('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".fa-caret-down").removeClass("fa-caret-down").addClass("fa-caret-up");
  }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".fa-caret-up").removeClass("fa-caret-up").addClass("fa-caret-down");
});