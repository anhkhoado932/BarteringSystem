$(document).ready(function() {
    $('#registerButton').click(function() {
        window.location.href = '/register-page';
    $('#priceFilter').on('change', function() {
        let range = $(this).val();
        window.location.href = "/item?priceRange=" + range;
    });
});