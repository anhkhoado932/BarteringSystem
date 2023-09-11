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
    const progressBar = $(".transaction-details-progress");
    messageBtn.on("click", function (event) {
        event.preventDefault();
        const isOpening = chatbox.hasClass("hidden");
        chatbox.toggleClass("hidden"); // toggle chatbox state
        progressBar.toggleClass("hidden");
        if (isOpening) {
            onOpeningChatbox();
        } else {
            onClosingChatbox();
        }
    });
});

function onOpeningChatbox() {
    // Chatbox
    const chatbox = $(".transaction-chatbox");
    chatbox.html(`
    <div class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
    <span class="sr-only"></span>
    </div>
    </div>
    `);
    // Detail
    const messageBtn = $("#toggle-message-btn");
    messageBtn.html(`
        <i class="bi bi-chevron-double-left"></i>
        View Details
    `);
    $(".transaction-details-items .col").each(function () {
        $(this).addClass("col-12");
    });
    $(".transaction-details-items .col.trade-icon").html(
        '<i class="bi bi-arrow-down-up" style="font-size: 30px"></i>'
    );
}

function onClosingChatbox() {
    // Chatbox
    $(".transaction-chatbox").html("");

    // Detail
    const messageBtn = $("#toggle-message-btn");
    messageBtn.text("Open Chat");
    messageBtn.html(`
        <i class="bi bi-chevron-double-right"></i>
        View Chat
    `);
    $(".transaction-details-items .col.trade-icon").html(
        '<i class="bi bi-arrow-left-right" style="font-size: 50px"></i>'
    );
}
