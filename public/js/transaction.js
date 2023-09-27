const socket = io().connect('http://localhost:3000');

$(document).ready(function () {
    const chatbox = $('.transaction-chatbox');
    const details = $('.transaction-details');
    const messageBtn = $('#toggle-message-btn');

    messageBtn.on('click', toggleChatbox);

    $('.transaction-list-item').on('click', function () {
        const transactionId = $(this).attr('id');
        window.location.href = `/transaction?transactionId=${transactionId}`;
    });

    function toggleChatbox(event) {
        // Prevent auto reloading
        event.preventDefault();

        chatbox.hasClass('hidden') ? onOpeningChatbox() : onClosingChatbox();

        chatbox.toggleClass('hidden');
        details.toggleClass('collapsed');
    }

    function onOpeningChatbox() {
        socket.emit('start-message', {});

        const transactionId = getTransactionIdFromUrl();
        chatbox.html(renderLoadingSpinner());

        // Fetch pass messages and render to chatbox
        $.ajax({
            url: `/message/${transactionId}`,
            type: 'GET',
            complete: renderChatbox,
        });

        renderToggleButton((isOpening = true));
    }

    function onClosingChatbox() {
        chatbox.html('');
        renderToggleButton((isOpening = false));
    }

    function getTransactionIdFromUrl() {
        return new URLSearchParams(window.location.search).get('transactionId');
    }

    function renderLoadingSpinner() {
        return `
            <div class="chatbox d-flex align-items-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only"></span>
                </div>
            </div>
        `;
    }

    function renderToggleButton(isOpening) {
            const iconClass = isOpening
                ? 'bi bi-chevron-double-left'
                : 'bi bi-chevron-double-right';

            messageBtn.html(`
                <i class="${iconClass}"></i>
                ${isOpening ? 'View Details' : 'View Chat'}
            `);

            $('.transaction-details-items .col.trade-icon').html(
                isOpening
                    ? '<i class="bi bi-arrow-down-up" style="font-size: 30px"></i>'
                    : '<i class="bi bi-arrow-left-right" style="font-size: 50px"></i>'
            );

            setTimeout(() => {
                $('.transaction-details-items .col').toggleClass('col-12');
            }, 100);

    }

    socket.on('new-message', (data) => {
        renderMessages(data.message);
    });

    function renderChatbox(data) {
        chatbox.html(`
            <div class="chatbox"></div>
            <div class="input-group mb-3">
                <input type="text" class="chatbox-input form-control" placeholder="type here..." aria-label="type here..." aria-describedby="basic-addon2">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary chatbox-send" type="button">Send</button>
                </div>
            </div>
        `);

        console.log(data.responseJSON);
        renderMessages(data.responseJSON);

        $('.chatbox-send').on('click', function (event) {
            event.preventDefault();
            const newMessageContent = $('.chatbox-input').val();
            socket.emit('new-message', newMessageContent);
            renderMessages({
                content: newMessageContent,
                from_me: true,
            });
            $('.chatbox-input').val('');
        });
    }

    function renderMessages(data) {
        // Render new messages and scroll to bottom
        const chatbox = $('.chatbox');
        const messageElement = createMessageElement(data);
        chatbox
            .append(messageElement)
            .animate({ scrollTop: chatbox.prop('scrollHeight') }, 100);
    }

    function createMessageElement(data) {
        if (Array.isArray(data)) {
            return data
                .map((message, i) => {
                    const cssClass = [
                        message['from_me'] ? 'from-me' : 'from-them',
                    ];
                    if (
                        i !== data.length - 1 &&
                        message['from_me'] === data[i + 1]['from_me']
                    ) {
                        cssClass.push('no-tail');
                    }

                    return `<p class="${cssClass.join(' ')}">${
                        message.content
                    }</p>`;
                })
                .join(' ');
        }
        return `<p class=${data['from_me'] ? 'from-me' : 'from-them'}>${
            data.content
        }</p>`;
    }

    $('.transaction-confirm-finish-btn').on('click', function () {
        const transactionId = getTransactionIdFromUrl();
        sendTransactionRequest('/transaction/finish', transactionId);
    });

    $('.transaction-confirm-cancel-btn').on('click', function () {
        const transactionId = getTransactionIdFromUrl();
        sendTransactionRequest('/transaction/cancel', transactionId);
    });

    function sendTransactionRequest(url, transactionId) {
        $.ajax({
            url: url,
            type: 'POST',
            data: { transactionId },
            success: (data) => {
                if (typeof data.redirect === 'string') {
                    window.location = data.redirect;
                }
            },
        });
        $('#confirmFinish').modal('hide');
        $('#confirmCancel').modal('hide');
    }
});
