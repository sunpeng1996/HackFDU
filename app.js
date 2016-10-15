var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var net = require('net');  

var path = require('path');
//加载静态文件
app.use(express.static(path.join(__dirname,'/public')));

const P1 = {
	id:0,
	x:0,
	y:0,
	color:'#f00'
};

const P2 = {
	id:0,
	x:0,
	y:0,
	color: '#0f0'
};

const P3 = {
	id:0,
	x:0,
	y:0,
	color: '#00f'
};

var List = [];

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
            var tempId = dataStr.split(',')[0];
            if(List.indexOf(tempId) < 0) {
            	if (List.length >= 3) {
            		List.shift();
            	}
            	List.push(tempId);
            }
            if(tempId == List[0]) {
            	P1.id = tempId;
            	P1.x = dataStr.split(',')[1];
	        	P1.y = dataStr.split(',')[2];
            }else if (tempId == List[1]) {
            	P2.id = tempId;
            	P2.x = dataStr.split(',')[1];
	        	P2.y = dataStr.split(',')[2];
            }else {
            	P3.id = tempId;
            	P3.x = dataStr.split(',')[1];
	        	P3.y = dataStr.split(',')[2];
            }
            // console.log(List);
            // console.log(P1.id + "/" + P2.id + "/" + P3.id);
            io.emit('drawing',P1);
            io.emit('drawing',P2);
            io.emit('drawing',P3);
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
