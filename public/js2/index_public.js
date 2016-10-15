
$(document).ready(function(){
	
		textAnimation={
			slideLeft:function(target,extent,time){
				var nowVal=parseInt(target.css("margin-left"));
				target.css({"margin-left":nowVal+extent,"opacity":0});
				target.stop(false,true).delay(time).animate({"margin-left":nowVal,"opacity":1},{duration:1000,easing:"easeOutBounce"});
			},
			slideRight:function(target,extent,time){
				var nowVal=parseInt(target.css("margin-right"));
				target.css({"margin-right":nowVal+extent,"opacity":0});
				target.stop(false,true).delay(time).animate({"margin-right":nowVal,"opacity":1},{duration:1000,easing:"easeOutQuad"});
			},
			slideBottom:function(target,extent,time){
				var nowVal=parseInt(target.css("margin-bottom"));
				target.css({"margin-bottom":nowVal+extent,"opacity":0});
				target.stop(false,true).delay(time).animate({"margin-bottom":nowVal,"opacity":1},{duration:1000,easing:"easeOutBounce"});
			},
			slideTop:function(target,extent,time){
				var nowVal=parseInt(target.css("margin-top"));
				target.css({"margin-top":nowVal+extent,"opacity":0});
				target.stop(false,true).delay(time).animate({"margin-top":nowVal,"opacity":1},{duration:1500,easing:"easeOutQuad"});
			} //50--0---50
		};
	textAnimation.slideBottom($("canvas"),-50,500);
	textAnimation.slideLeft($("canvas"),-50,500);
	textAnimation.slideLeft($("top"),-50,500);

});

 
