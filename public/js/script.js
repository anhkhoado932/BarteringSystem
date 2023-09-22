$(document).ready(function () {
    setTimeout(function () {
        $('.temp-message').fadeOut('slow', function () {
            $(this).remove();
        });
    }, 3000); // 3 seconds

    $('.cancel-btn, .remove-fav-btn').on('click', function () {
        const item = $(this).data('item');

        //if the id is favorite id, it should be the same as product id
        let id;

        if (item === "favorite") {
            id = $(this).data('product-id');
        } else {
            id = $(this).data(`${item}-id`);
        }

        //use removeFromFavorites routes if the item is favorite
        let url;
        if (item === "favorite") {
            url = `/product/removeFromFavorites/${id}`;
        } else {
            url = `/${item}s/${id}`;
        }
        console.log("URL to delete:", url);

        $.ajax({
            url: url,
            type: 'DELETE',
            success: function (result) {
                $('#message').text(`The ${item} has been ${(item === 'favorite') ? 'removed from favorites' : 'deleted'}`).fadeIn().delay(3000).fadeOut();
                setTimeout(() => {
                    location.reload();
                }, 3100);
            }
        });
    });

    $('#registerButton').click(function () {
        window.location.href = '/register-page';
    })
    $('#priceFilter').on('change', function () {
        let range = $(this).val();
        window.location.href = "/product?priceRange=" + range;
    });
});
