var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);

app.use(express.static(__dirname + "/public"));
app.get("/", function(req, res){
	res.sendfile(__dirname + "/public/index.html");
});

var usernames = {};

io.sockets.on("connection", function(socket){
	socket.on("adduser", function(username){
		socket.username = username;
		usernames[username] = username;
		socket.emit("updatechat", "SERVER", "You have connected");
		socket.broadcast.emit("updatechat", "SERVER", username + " has connected");
		io.sockets.emit("updateusers", usernames);
	});
	socket.on('image', function (msg) {
        io.sockets.emit('image', socket.username, msg);
    });
		socket.on("sendchat", function(data){
		io.sockets.emit("updatechat", socket.username, data);
	});
		socket.on("disconnect", function(){
		delete usernames[socket.username];
		socket.broadcast.emit("updatechat", "SERVER", socket.username + " has disconnected");
		io.sockets.emit("updateusers", usernames);
	});
});
server.listen(8080);
console.log("Port is running...");