var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var net = require('net');  

var path = require('path');
//加载静态文件
app.use(express.static(path.join(__dirname,'/public')));

const DATA = {
	x:[],
	y:[]
};

app.get('/' , function(req , res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('链接已建立。');

    socket.on('photo', function (data) {  
    	var bitmap = new Buffer(data, 'base64');
        console.log('开始写入.');
		fs.writeFile(__dirname + '/photo.png',bitmap,function (err) {
			if (err) {
				return console.error(err);
			}
			console.log('数据写入成功!');
		}); 
    });
});

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口  
// 传入net.createServer()的回调函数将作为”connection“事件的处理函数  
// 在每一个“connection”事件中，该回调函数接收到的socket对象是唯一的  
function createServer(HOST,PORT) {
    net.createServer(function(sock) {  
  
        // 我们获得一个连接 - 该连接自动关联一个socket对象  
        console.log('CONNECTED: ' +  
            sock.remoteAddress + ':' + sock.remotePort);  

        // 为这个socket实例添加一个"data"事件处理函数  
        sock.on('data', function(data) {  
            console.log('DATA from ' + sock.remoteAddress + ': ' + data);
            var dataStr = data.toString();
            var dataX = dataStr.split(',')[0];
            var dataY = dataStr.split(',')[1];
            // DATA.x = tempX;
            // DATA.y = tempY;
            io.emit('drawing',dataX,dataY);
        });  
      
        // 为这个socket实例添加一个"close"事件处理函数  
        sock.on('close', function(data) {  
            console.log('CLOSED: ' +  
                sock.remoteAddress + ' ' + sock.remotePort);  
        });  
      
    }).listen(PORT, HOST);  

    console.log('Socket listen on ' + HOST + ':' + PORT);

}

http.listen(3000, function(){
  console.log('listening on *:3000');
  createServer('10.221.64.154',2333);
});
