/* eslint-disable import/extensions */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

export default async function decorate() {
  function insuranceProductCarousel({ swiper, extendParams, on }) {
    extendParams({
      debugger: false,
    });

    on('init', () => {
      if (!swiper.params.debugger) return;
      console.log('init');
    });
    on('click', (swiperItem) => {
      if (!swiperItem.params.debugger) return;
      console.log('click');
    });
    on('tap', (swiperItem) => {
      if (!swiperItem.params.debugger) return;
      console.log('tap');
    });
    on('doubleTap', (swiperItem) => {
      if (!swiperItem.params.debugger) return;
      console.log('doubleTap');
    });
    on('sliderMove', (swiperItem) => {
      if (!swiperItem.params.debugger) return;
      console.log('sliderMove');
    });
    on('slideChange', () => {
      if (!swiper.params.debugger) return;
      console.log(
        'slideChange',
        swiper.previousIndex,
        '->',
        swiper.activeIndex,
      );
    });
    on('slideChangeTransitionStart', () => {
      if (!swiper.params.debugger) return;
      console.log('slideChangeTransitionStart');
    });
    on('slideChangeTransitionEnd', () => {
      if (!swiper.params.debugger) return;
      console.log('slideChangeTransitionEnd');
    });
    on('transitionStart', () => {
      if (!swiper.params.debugger) return;
      console.log('transitionStart');
    });
    on('transitionEnd', () => {
      if (!swiper.params.debugger) return;
      console.log('transitionEnd');
    });
    on('fromEdge', () => {
      if (!swiper.params.debugger) return;
      console.log('fromEdge');
    });
    on('reachBeginning', () => {
      if (!swiper.params.debugger) return;
      console.log('reachBeginning');
    });
    on('reachEnd', () => {
      if (!swiper.params.debugger) return;
      console.log('reachEnd');
    });
  }

  // Init Swiper
  // eslint-disable-next-line no-unused-vars
  const swiper = new Swiper('.swiper', {
    // Install Plugin To Swiper
    modules: [insuranceProductCarousel],
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    speed: 700,
    slidesPerView: 4,
    slidesPerGroup: 1,
    resistanceRatio: 0.85,
    touchReleaseOnEdges: true,
    effect: 'slide',
    // Enable debugger
    debugger: true,
  });
}
