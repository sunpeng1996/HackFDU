
paper.install(window);
window.onload = function(){
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    paper.setup(c);

    var socket = io();
    socket.on('drawing', function(DATA) {
        if(DATA.id > 0) {
            var myCircle = new Path.Circle(new Point(DATA.x, DATA.y), 15);
            myCircle.strokeColor = DATA.color;
            myCircle.selected = true;
            console.log(color);
        }else {
            /*source-over 默认,相交部分由后绘制图形的填充(颜色,渐变,纹理)覆盖,全部浏览器通过*/
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(DATA.x, DATA.y, 20, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(250,250,250,0)";
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        }
    });
}


function getUrl() {
    var imageData=c.toDataURL();
    imageData = imageData.replace(/^data:image\/(png|jpg);base64,/,"");
    socket.emit('photo',imageData);
}
