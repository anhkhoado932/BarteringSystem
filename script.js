$(document).ready(function() {
    $('#priceFilter').on('change', function() {
        let range = $(this).val();
        window.location.href = "/item?priceRange=" + range;
    });
});