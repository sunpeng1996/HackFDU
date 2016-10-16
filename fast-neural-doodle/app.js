var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var net = require('net'); 
var server = require('./server');

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

var Client_HOST = '127.0.0.1';  
var Client_PORT = 20000; 

app.get('/' , function(req , res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	console.log('链接已建立。');

    socket.on('photo', function (data) {  
    	var bitmap = new Buffer(data,'base64'); 
    	createClient(bitmap);
    });
});

function createClient(data) {

	var client = new net.Socket();  
	client.connect(Client_PORT, Client_HOST, function() {  
	  
	    console.log('CONNECTED TO: ' + Client_HOST + ':' + Client_PORT);  
	    client.write(data); 
	    	  
	});  
	  
	// 为客户端添加“data”事件处理函数  
	// data是服务器发回的数据  
	client.on('data', function(data) {  
	    console.log('DATA: ' + data);  
	     client.destroy();

	});  
	  
	// 为客户端添加“close”事件处理函数  
	client.on('close', function() {  
		// 完全关闭连接   
	    console.log('Connection closed');  
	});  
}

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
	    if(dataStr.split(',')[0] == 'end') {
		fs.writeFile(__dirname + '/public/output.jpg',dataStr.split(',')[1],function (err) {
			if(err) {
				console.log(err);			
			}
		});
	
	    }else {

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

		}
            
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
  createServer('10.221.128.53',2333);
});

var HOST = '127.0.0.1';
var PORT_1 = 20000;

server.createServer(HOST,PORT_1);
