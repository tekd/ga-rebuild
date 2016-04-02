$('.b-slider').slick({
    arrows: true,
    draggable: false,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
        {
            breakpoint: 800,
            settings: {
                draggable: true,
            }
        }
    ]
});