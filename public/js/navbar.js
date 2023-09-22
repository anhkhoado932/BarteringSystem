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

$(document).ready(function() {
    $("#login-form").submit(function (e) {
        // prevent default reloading
        e.preventDefault();

        // if exist a redirect path, append it to the request URL
        let url = "/login";
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        if (redirect) {
            url = url.concat(`?redirect=${redirect}`);
        }

        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: url,
            success: function(data) {
                const repath = data.redirect;
                window.location.href = repath;
            },
            error: function (data) {
                const message = data.responseJSON['message'];
                $("#error-message").html(`<div style="color: red">${message}</div>`)
            }
        })
    })
})
