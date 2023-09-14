$(document).ready(function() {
 feature/product-upload-delete
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

//TODO: transactionScript.js
const socket = io().connect("http://localhost:3000");

$(document).ready(function () {
    const chatbox = $(".transaction-chatbox");
    const messageBtn = $("#toggle-message-btn");
    const progressBar = $(".transaction-details-progress");
    const userInfo = $(".transaction-details-baterer");
    messageBtn.on("click", function (event) {
        event.preventDefault();
        const isOpening = chatbox.hasClass("hidden");
        chatbox.toggleClass("hidden"); // toggle chatbox state
        progressBar.toggleClass("hidden");
        userInfo.toggleClass("hidden");
        if (isOpening) {
            onOpeningChatbox();
        } else {
            onClosingChatbox();
        }
    });

    $(".transaction-list-item").on("click", function () {
        const id = $(this).attr("id");
        window.location.href = `/transaction?transactionId=${id}`;
    });
});

function onOpeningChatbox() {
    // Chatbox
    socket.emit("start-message", {});
    const transactionId = new URLSearchParams(window.location.search).get(
        "transactionId"
    );
    $.ajax({
        url: `/message/${transactionId}?page=0`,
        type: "GET",
        beforeSend: function () {
            $(".transaction-chatbox").html(`
                <div class="chatbox d-flex align-items-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
            `);
        },
        complete: renderChatbox,
    });

    // Detail
    setTimeout(() => {
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
    }, 100);
}

function onClosingChatbox() {
    // Chatbox
    $(".transaction-chatbox").html("");

    // Detail
    setTimeout(() => {
        const messageBtn = $("#toggle-message-btn");
        messageBtn.html(`
        <i class="bi bi-chevron-double-right"></i>
        View Chat
    `);

        $(".transaction-details-items .col").each(function () {
            $(this).removeClass("col-12");
        });
        $(".transaction-details-items .col.trade-icon").html(
            '<i class="bi bi-arrow-left-right" style="font-size: 50px"></i>'
        );
    }, 100);
}

$(document).ready(function () {
    socket.on("new-message", (data) => {
        addMessages(data.message);
    });
});

function renderChatbox(data) {
    $(".transaction-chatbox").html(`
    <div class="chatbox"></div>
    <div class="input-group mb-3">
        <input type="text" class="chatbox-input form-control" placeholder="type here..." aria-label="type here..." aria-describedby="basic-addon2">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary chatbox-send" type="button">Send</button>
        </div>
    </div>
    `);

    addMessages(data.responseJSON);

    $(".chatbox-send").on("click", function (event) {
        event.preventDefault();
        const newMessageContent = $(".chatbox-input").val();
        socket.emit("new-message", newMessageContent);
        addMessages({
            content: newMessageContent,
            from_me: true,
        });
        $(".chatbox-input").val("");
    });
}

/**
 * Append new messages to chatbox and scroll to bottom
 */
function addMessages(data) {
    const chatbox = $(".chatbox");
    const messageElement = createMessageElement(data);
    chatbox
        .append(messageElement)
        .animate({ scrollTop: chatbox.prop("scrollHeight") }, 100);
}

function createMessageElement(data) {
    if (Array.isArray(data)) {
        return data
            .map((message, i) => {
                const cssClass = [];
                cssClass.push(message["from_me"] ? "from-me" : "from-them");
                if (
                    i != data.length - 1 &&
                    message["from_me"] == data[i + 1]["from_me"]
                ) {
                    cssClass.push("no-tail");
                }

                return `<p class="${cssClass.join(" ")}">${
                    message.content
                }</p>`;
            })
            .join(" ");
    }
    return `<p class=${data["from_me"] ? "from-me" : "from-them"}>${
        data.content
    }</p>`;
}

$(document).ready(function () {
    $(".transaction-confirm-finish-btn").on("click", function () {
        const transactionId = new URLSearchParams(window.location.search).get(
            "transactionId"
        );
        $.ajax({
            url: `/transaction/finish`,
            type: "POST",
            data: { transactionId },
            success: (data) => {
                if (typeof data.redirect == 'string')
                    window.location = data.redirect
            }
        });
        $("#confirmFinish").modal("hide");
    });
    $(".transaction-confirm-cancel-btn").on("click", function () {
        const transactionId = new URLSearchParams(window.location.search).get(
            "transactionId"
        );
        $.ajax({
            url: `/transaction/cancel`,
            type: "POST",
            data: { transactionId },
            success: (data) => {
                if (typeof data.redirect == 'string')
                    window.location = data.redirect
            }
        });
        $("#confirmCancel").modal("hide");
    });
});
 main
