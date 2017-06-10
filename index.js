var express = require("express");
var app = express();

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var server = require("http").createServer(app);
var io = require("socket.io")(server);

server.listen(3000);
console.log("Server listening on port 3000...");

// Mang chua danh sach user.
var listUsers = [];

io.on("connection", function(socket) {
    console.log("Co nguoi ket noi " + socket.id);

    // Lang nghe su kien dang ki cua nguoi dung.
    socket.on("client-send-username", function(data) {
        if (listUsers.indexOf(data) >= 0) {
            // Dang ki that bai.
            socket.emit("server-send-fail");
        } else {
            // Dang ki thanh cong.
            listUsers.push(data);
            socket.Username = data;
            socket.emit("server-send-success", data);
            // Truyen den tat ca user.
            io.sockets.emit("server-send-listUsers", listUsers);
        }

    });

    // Lang nghe su kien logout cua nguoi dung.
    socket.on("logout", function() {
        listUsers.splice(
            listUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit("server-send-listUsers", listUsers);
    });
    // Lang nghe su kien nguoi dung dang nhap message.
    socket.on("user-sending", function() {
        console.log(socket.Username + " dang go chu!");
        var str = socket.Username + " dang go chu!";
        io.sockets.emit("someone-typing", str);
    });

    // Lang nghe su kien nguoi dung ngung go chu.
    socket.on("user-stop-sending", function() {
        console.log(socket.Username + " ngung go chu!");
        io.sockets.emit("someone-stop-typing");
    });

    // Lang nghe su kien client gui message.
    socket.on("client-send-message", function(data) {
        io.sockets.emit("server-send-message", { username: socket.Username, noidung: data });
    });

    // Lang nghe su kien mat ket noi.
    socket.on("disconnect", function() {
        console.log(socket.id + " ngat ket noi!!");
    });

});

app.get("/", function(req, res) {
    res.render("trangchu");
});