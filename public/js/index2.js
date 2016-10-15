(function(){
    var socket = io();
    socket.on('drawing', function(DATA) {
        if(DATA.id > 0) {
            draw(DATA);
        }else {
            resetEraser(DATA);
        }
    });
})();

var c=document.getElementById("myCanvas");
var ctx=c.getContext("2d");

function draw(DATA) {
    var color = DATA.color;
    console.log(color);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(DATA.x,DATA.y,5,0,Math.PI*2,true);
    ctx.fill();
    ctx.closePath();
}

function resetEraser(DATA) {
    /*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(DATA.x, DATA.y, 20, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(250,250,250,0)";
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
}

function getUrl() {
    var imageData=c.toDataURL();
    imageData = imageData.replace(/^data:image\/(png|jpg);base64,/,"");
    socket.emit('photo',imageData);
}
