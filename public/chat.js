$(document).ready(function () {
    var socket = io();
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('newMessage', $('#messageBox').val());
        $('#messageBox').val('');
        return false;
    });
    socket.on('message', function (data) {
        $('#messages').append($('<li>').text(data.username + ': ' + data.message));
    });

    $('#exit').click((e)=> {
        e.preventDefault(); // prevents page reloading
        window.location.href = "/logout";
    })
});