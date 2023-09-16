$(document).ready(function () {
    const navlinks = $('.nav-link');
    const navlinkDict = {}
    navlinks.each(function () {
        navlinkDict[$(this).attr('href')] = $(this);
        $(this).removeClass('active')
    })
    
    const path = window.location.pathname;
    navlinkDict[path].addClass('active');
})
