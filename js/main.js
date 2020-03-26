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