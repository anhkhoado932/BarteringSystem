$(document).ready(function () {
    const navlinks = $('.nav-link');
    const path = window.location.pathname;
    
    navlinks.each(function () {
        if (path.startsWith($(this).attr('href'))){
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }
    })
})
