$(document).ready(function () {
    const path = window.location.pathname;
    const navlinks = $('.nav-link');
    
    // Update current active navlink
    navlinks.each(function () {
        if (path == '/' && $(this).attr('href') == '/home') {
            $(this).addClass('active');
        }
        else if (path.startsWith($(this).attr('href'))){
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

        // send POST login request
        $.ajax({
            data: $(this).serialize(),
            type: "POST",
            url: url,
            success: function(data) {
                window.location.href = data.redirect;
            },
            error: function (data) {
                const message = data.responseJSON['message'];
                $("#error-message").html(`<div style="color: red">${message}</div>`)
            }
        })
    })
})
