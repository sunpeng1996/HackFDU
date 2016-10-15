var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var path = require('path');
//加载静态文件
app.use(express.static(path.join(__dirname,'/public')));


app.get('/' , function(req , res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('链接已建立。');
  	socket.on('drawing' , function(data){
        io.emit('drawing_back' , data);
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});