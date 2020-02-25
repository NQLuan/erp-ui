$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

});

$(document).ready(function () {

    $('#togglelogin').on('click', function () {
        $('#loginform').click(function () {
            $("p").toggle();
        });
    });

});

