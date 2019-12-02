var socket;
$(document).ready(function(){
	socket = io.connect("http://localhost:8080");
	socket.on('image', image);
	socket.on("connect", addUser);
	socket.on("updatechat", processMsg);
	socket.on("updateusers", updateUser);
	$('#upload').on('change', uploadImage);
	$("#sendData").on("click", sendMsg);
	$("#userInput").on("keypress", entenPressed);
	$("#userInput").focus();
});
function uploadImage(e){
    var file = e.originalEvent.target.files[0],
        reader = new FileReader();
    reader.onload = function(evt){
        socket.emit('image', evt.target.result);
    };
    reader.readAsDataURL(file);  
};
function addUser(){
	socket.emit("adduser", prompt("Enter your name"));
}
function image (name, Image) {
	$("<b>" + name +": </b>" + '<img style="height:200px; width: 200px;" src="' + Image + '"/><br/>').prependTo($("#msg"));
}
function processMsg(username, data){
	$("<div id='msgDiv'><b>" + username +":</b> "+ data +"</div>").prependTo($("#msg"));
}
function updateUser(data){
	$("#userList").empty();
	$.each(data, function(key, value){
		$("#userList").append("<div>" + key + "</div>");
	});
}
function sendMsg(){
	var msg = $("#userInput").val();
	socket.emit("sendchat", msg);
	$("#userInput").val('');
	$("#userInput").focus();
}
function entenPressed(e){
	if(e.which == 13){
		e.preventDefault();
		sendMsg();
	}
}
$(document).ready(function () {
    var realFile = $('#upload');
    var btnFile = $('#uploadFile');
    btnFile.click(function () {
        realFile.click();
    });
});