$(document).ready(function () {
    setTimeout(function () {
        $('.temp-message').fadeOut('slow', function () {
            $(this).remove();
        });
    }, 3000); // 3 seconds

    //get the latest notifications
    function fetchLatestNotification() {
        $.ajax({
            url: '/notifications/latest',
            method: 'GET',
            success: function (response) {
                if (response && response.message && response.message !== "No active notifications") {
                    displayNotification(response.message);
                } else if (response && response.welcomeMessage) {
                    displayNotification(response.welcomeMessage);
                }
            },
            error: function (error) {
                console.error("Error fetching notifications:", error);
            }
        });
    }

    //display notification
    function displayNotification(message) {
        const notificationHTML = `

        <div class="notification-banner">
            ${message}
            <button class="close-notification">X</button>
        </div>
    `;

        $("body").prepend(notificationHTML);
        $(".notification-banner").slideDown();

        $(".close-notification").on("click", function () {
            $(".notification-banner").slideUp(function () {
                $(this).remove();
            });
        });
        setTimeout(function () {
            $(".notification-banner").slideUp(function () {
                $(this).remove();
            });
        }, 5000);
    }

    if ($("#homePage").length) {
        fetchLatestNotification();
    }

    $('.cancel-btn, .remove-fav-btn, .delete-user-btn, .delete-product-btn, .delete-feedback-btn').on('click', function () {

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
        window.location.href = '/register';
    })
    $('#priceFilter').on('change', function () {
        let range = $(this).val();
        window.location.href = "/product?priceRange=" + range;
    });

    $('.edit-user-btn').click(function () {
        const userId = $(this).data('user-id');
        window.location.href = `/edit-user/${userId}`;
    });

    $('.edit-product-btn').click(function () {
        const productId = $(this).data('product-id');
        window.location.href = `/edit-product/${productId}`;
    });
});
