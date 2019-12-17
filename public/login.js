$(document).ready(function () {
    var username;
    $("form").submit(function (e) {
        e.preventDefault(); // prevents page reloading
        username = $("#username").val();
        $.post("/login", { username: username }, (data) => {
            console.log(data);
            if (data == 'done') {
                window.location.href = "/";
            }
        });
    });
});