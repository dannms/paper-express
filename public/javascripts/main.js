AOS.init();

$(window).on('scroll', function () {
    if ($(window).scrollTop() > 70) {
        $('.navigation').addClass('isScrolled');
    } else {
        $('.navigation').removeClass('isScrolled');
    }
});

document.querySelector('#alerta').focus()