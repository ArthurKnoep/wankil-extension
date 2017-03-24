var snow = {

	wind : 0,
	maxXrange : 100,
	minXrange : 10,
	maxSpeed : 1.5,
	minSpeed : 0.5,
	color : "#fff",
	char : "*",
	maxSize : 30,
	minSize : 15,

	flakes : [],
	WIDTH : 0,
	HEIGHT : 0,

	init : function(nb){
		var o = this,
			frag = document.createDocumentFragment();
		o.getSize();

		for(var i = 0; i < nb; i++){
			var flake = {
				x : o.random(o.WIDTH),
				y : - o.maxSize,
				xrange : o.minXrange + o.random(o.maxXrange - o.minXrange),
				yspeed : o.minSpeed + o.random(o.maxSpeed - o.minSpeed, 100),
				life : 0,
				size : o.minSize + o.random(o.maxSize - o.minSize),
				html : document.createElement("span")
			};

			flake.html.style.position = "absolute";
			flake.html.style.zIndex = -1;
			flake.html.style.top = flake.y + "px";
			flake.html.style.left = flake.x + "px";
			flake.html.style.fontSize = flake.size + "px";
			flake.html.style.color = o.color;
			flake.html.appendChild(document.createTextNode(o.char));

			frag.appendChild(flake.html);
			o.flakes.push(flake);
		}

		document.body.appendChild(frag);
		o.animate();
	},

	animate : function(){
		var o = this;
		for(var i = 0, c = o.flakes.length; i < c; i++){
			var flake = o.flakes[i],
				top = flake.y + flake.yspeed,
				left = flake.x + Math.sin(flake.life) * flake.xrange + o.wind;
			if(top < o.HEIGHT - flake.size - 10 && left < o.WIDTH - flake.size && left > 0){
				flake.html.style.top = top + "px";
				flake.html.style.left = left + "px";
				flake.y = top;
				flake.x += o.wind;
				flake.life+= .01;
			}
			else {
				flake.html.style.top = -o.maxSize + "px";
				flake.x = o.random(o.WIDTH);
				flake.y = -o.maxSize;
				flake.html.style.left = flake.x + "px";
				flake.life = 0;
			}
		}
		setTimeout(function(){
			o.animate();
		}, 20);
	},

	random : function(range, num){
		var num = num?num:1;
		return Math.floor(Math.random() * (range + 1) * num) / num;
	},

	getSize : function(){
		this.WIDTH = document.body.clientWidth || window.innerWidth;
		this.HEIGHT = document.body.clientHeight || window.innerHeight;
	}
};

function start_anim(){
	var date = new Date();
	var modeN;

	modeN = 1;
	chrome.storage.sync.get('modeNoel', function(get) { //Vérif si le parametre existe
			if (get['modeNoel'] != null) {
					modeN = get['modeNoel'];
			} else {
					modeN = 1;
			}
			if (date.getMonth() == 11 && modeN == 1)
				{
					$("body").css("background", "-webkit-linear-gradient(top, #3f4c6b 0%,#224 100%");
					$("body").css("background-color", "-webkit-linear-gradient(top, #3f4c6b 0%,#224 100%");
					$("#status").css("background-color", "rgba(63, 81, 181, 0.5)");
					$(".openInfo").css("border", "2px solid rgba(255, 255, 255, 0.45)");
					$(".openInfo").css("color", "rgba(255, 255, 255, 0.6)");
					$("#status").css("z-index", "500");
					$("span").css("z-index", "500");
					snow.init(20);
				}
	});
}

start_anim();
