$(function() {
    $('.styleLink').click(function() {
        var figure = $(this);

        $('.picture').addClass('picture_disabled');
        figure.parents('.picture').removeClass('picture_disabled');


    });
});