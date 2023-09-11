$(document).ready(function() {
    $('#registerButton').click(function() {
        window.location.href = '/register-page';
    })
    $('#priceFilter').on('change', function() {
        let range = $(this).val();
        window.location.href = "/item?priceRange=" + range;
    });
});

//TODO: transactionScript.js
$(document).ready(function () {
    const chatbox = $(".transaction-chatbox");
    const messageBtn = $("#toggle-message-btn");
    messageBtn.on("click", function (event) {
        event.preventDefault();
        const isCurrentlyCollapsed = !chatbox.hasClass("hidden");
        const messageBtnContent = isCurrentlyCollapsed
            ? "Open Chat"
            : "View Details";
        messageBtn.text(messageBtnContent);
        chatbox.toggleClass("hidden");
        $(".transaction-details-items .col").each(function () {
            $(this).toggleClass("col-12");
        });
    });
});

// function renderCollapsedDetailsLayout() {
//     $(".transaction-details-items .col").each(function () {
//         $(this).toggleClass("col-12");
//     });
//     console.log($(".transaction-details-items .col"));
// }

// function renderFullDetailsLayout() {
//     $(".transaction-details-items .col").each(function () {
//         $(this).toggleClass("col-12");
//     });
// }
