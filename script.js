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
});

function onOpeningChatbox() {
    // Chatbox
    socket.emit("start-message", {});

    const chatboxContainer = $(".transaction-chatbox");
    jQuery.ajax({
        url: "/message?transactionId=&page=0",
        type: "GET",
        beforeSend: function () {
            chatboxContainer.html(`
                <div class="chatbox d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
            `);
        },
        complete: function (data) {
            chatboxContainer.html(`
            <div class="chatbox"></div>
            <div class="input-group mb-3">
                <input type="text" class="chatbox-input form-control" placeholder="type here..." aria-label="type here..." aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary chatbox-send" type="button">Send</button>
                </div>
            </div>
            `);
        },
    });

    // Detail
    const messageBtn = $("#toggle-message-btn");
    messageBtn.html(`
        <i class="bi bi-chevron-double-left"></i>
        View Details
    `);
    c;
    setTimeout(() => {
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
    const messageBtn = $("#toggle-message-btn");
    messageBtn.html(`
        <i class="bi bi-chevron-double-right"></i>
        View Chat
    `);

    setTimeout(() => {
        $(".transaction-details-items .col").each(function () {
            $(this).removeClass("col-12");
        });
        $(".transaction-details-items .col.trade-icon").html(
            '<i class="bi bi-arrow-left-right" style="font-size: 50px"></i>'
        );
    }, 100);
}

$(document).ready(function () {
    socket.on("message", (data) => {
        const { type, content } = data.message;

        let newMesssage;
        if (type == "emoji") {
            newMesssage = `<p class="from-them">${content}</p>`;
        } else if (type == "image") {
            newMesssage = `<p class="from-them">Unsupported</p>`;
        } else {
            newMesssage = `<p class="from-them">${content}</p>`;
        }
        appendAndScroll($(".chatbox"), newMesssage);
    });
});

$(document).ready(function () {
    $("chatbox-send").on("submit", function (event) {
        event.preventDefault();
        const newMessage = $("chatbox-input").val();
        socket.emit("message", newMessage);

        $("chatbox-input").val("");
        appendAndScroll($(".chatbox"), `<p class="from-them">${content}</p>`);
    });
});

function appendAndScroll(element, content) {
    element
        .append(content)
        .animate({ scrollTop: element.prop("scrollHeight") }, 200);
}
