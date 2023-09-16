$(document).ready(function() {
    setTimeout(function() {
        $('.temp-message').fadeOut('slow', function() {
            $(this).remove();
        });
    }, 5000); // 5 seconds

    $('.cancel-btn').on('click', function() {
        const productId = $(this).data('product-id');
        
        $.ajax({
            url: `/api/products/${productId}`,
            type: 'DELETE',
            success: function(result) {
                // Display message
                $('#message').text('The product has been cancelled').css({
                    'background-color': 'green',
                    'text-align': 'center',
                    'padding': '10px',
                    'color': 'white'
                }).fadeIn().delay(5000).fadeOut(); 

                setTimeout(() => {
                    location.reload(); // refresh the page
                }, 5100);
            }
        });
    });

    $('#registerButton').click(function() {
        window.location.href = '/register-page';
    })
    $('#priceFilter').on('change', function() {
        let range = $(this).val();
        window.location.href = "/item?priceRange=" + range;
    });
});

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
