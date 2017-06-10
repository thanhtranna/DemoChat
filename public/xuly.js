var socket = io("http://localhost:3000");

// Lang nghe su kien dang ki that bai.
socket.on("server-send-fail", function() {
    alert("Username da ton tai!!");
});
// Lang nghe su kien dang ki thang cong.
socket.on("server-send-success", function(data) {
    // Hien ten user hien tai.
    $("#currentUser").html(data);
    $("#loginForm").hide(2000);
    $("#chatForm").show(1000);
});

// Lang nghe Server tra danh sanh user ve client.
socket.on("server-send-listUsers", function(data) {
    $("#boxContent").html("");
    data.forEach(function(i) {
        $("#boxContent").append("<div class = 'userOnline' >" + i + "</div>");
    }, this);
});

// Lang nghe Server gui tin nhawn ve cho client.
socket.on("server-send-message", function(data) {
    $("#listMessage").append("<div class='message'>" + data.username + " : " + data.noidung + "</div>");
});
// Lang nghe su kien nguoi dung nhap message.
socket.on("someone-typing", function(data) {
    $("#notification").html("<img width='20px' class='typing' src='typing05.gif'>" + data);
});
// Lang nghe su kien nguoi dung ngung nhap van ban.
socket.on("someone-stop-typing", function() {
    $("#notification").empty();
});

$(document).ready(function() {
    $("#loginForm").show();
    $("#chatForm").hide();
    // Khi nguoi dung dang nhap van ban.
    $("#txtMessage").focusin(function() {
        socket.emit("user-sending");
    });
    // Khi nguoi dung da nhap van ban.
    $("#txtMessage").focusout(function() {
        socket.emit("user-stop-sending");
    });
    // Khi nguoi dung dang nhap
    $("#btnRegister").click(function() {
        socket.emit("client-send-username", $("#txtUsername").val());
        // $("#txtUsername").val() = "";
    });
    // Khi nguoi dung dang xuat.
    $("#btnLogout").click(function() {
        socket.emit("logout");
        $("#chatForm").hide(2000);
        $("#loginForm").show(1000);
        $("#txtUsername").val() = "";
    });
    // Khi nguoi dung nhap vao tin nhan va gui di.
    $("#btnSendMessage").click(function() {
        socket.emit("client-send-message", $("#txtMessage").val());
    });



});