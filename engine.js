//ENGINE.JS - main JS file for game

var Engine = { //main Engine object

	//VARIABLES
	//--------------------------------------------------------------------------/
	Player: { //player object
		Coins: 0, //how many coins player has
		PerClick: 1, //how many coins per click
		PerIncrement: 1, //how many coins per increment
		Increment: 2000 //2sec increment
	},
	Canvas: { //canvas object
		Element: null, //canvas element
		Context: null //will be 2d context
	},
	Timers: { //this holds all sorts of timers
		Increment: null, //this is the main coin increment
	},

	//ELEMENTS
	//--------------------------------------------------------------------------/
	Elements: { //this holds the elements
		ClickBox: { //this is our main click element
			x: 320, y: 180, //position
			w: 128, h: 128 //size
		}
	},

	//INIT
	//--------------------------------------------------------------------------/
	Init: function() { //initial
		Engine.Canvas = document.createElement('canvas');
		Engine.Canvas.id = "display";
		Engine.Canvas.width = 800;
		Engine.Canvas.height = 600;
		$('body').append(Engine.Canvas);

		// Engine.AddClick(); //start the main click event
		// Engine.StartIncrement(); //start the auto coins	

		Engine.Canvas.Context = Engine.Canvas.getContext('2d');
		Engine.GameLoop();
	},

	//EVENT HANDLERS
	//--------------------------------------------------------------------------/
	StartIncrement: function() { //automatic coins
		Engine.Timers.Increment = setInterval(function() { //set the Timer as an interval
			Engine.Player.Coins += Engine.Player.PerIncrement;
		}, Engine.Player.Increment); //set to the players increment time
	},
	AddClick: function() { //the click function
		$(Engine.Canvas).on('click', function(m) { //we add a click to the Engine.Canvas object (note the 'm')
			if (m.pageX >= Engine.Elements.ClickBox.x && m.pageX <= (Engine.Elements.ClickBox.x + Engine.Elements.ClickBox.w)) { //check to see if the click is within the box X co-ordinates
				if (m.pageY >= Engine.Elements.ClickBox.y && m.pageY <= (Engine.Elements.ClickBox.y + Engine.Elements.ClickBox.h)) { //check to see if the click is within the box Y co-ordinates
					Engine.Player.Coins += Engine.Player.PerClick; //increase the coins by the PerClick amount!
				}
			}
			return false;
		});
	},

	GameRunning: null,
	Update: function() {
		Engine.Draw();
	},
	Draw: function() { //this is where we will draw all the information for the game!
		Engine.Canvas.Context.clearRect(0,0,Engine.Canvas.width,Engine.Canvas.height); //clear the frame

		Engine.Pattern(0, 0, 860, 660, "assets/img/bg-b.jpg");

		Engine.Circle(75, 75, 50, "green");

		for (var y = 20; y < 560; y+= 40) {
			for (var x = 20; x < 760; x+= 40) {
				Engine.Rect(x, y, 20, 20, "teal");
			}	
		}
		
		/** click button! **/
		// Engine.Rect(Engine.Elements.ClickBox.x, Engine.Elements.ClickBox.y, Engine.Elements.ClickBox.w, Engine.Elements.ClickBox.h, "silver"); //use the Rect function to draw the click button!
		// Engine.Text("CLICK ME", 330, 210, "Calibri", 28, "orange"); //click button text
		
		/** display/hud **/
		// Engine.Text(Engine.Player.Coins + " Coins", 16, 32, "Calibri", 20, "blue"); //coin display
		// Engine.Text(Engine.Player.PerClick + " Coins per click", 16, 56, "Calibri", 20, "blue"); //per click display
		// Engine.Text(Engine.Player.PerIncrement + " Coins every " + (Engine.Player.Increment / 1000) + "secs", 16, 80, "Calibri", 20, "blue"); //increment display
		
		Engine.GameLoop(); //re-iterate back to gameloop
	},
	GameLoop: function() {
		Engine.GameRunning = setTimeout(function() {
			// console.log('test');
			requestAnimFrame(Engine.Update, Engine.Canvas);
		}, 10);
	},

	//DRAWING ROUTINES
	//--------------------------------------------------------------------------/
	Rect: function(x, y, w, h, col) {
		if (col.length > 0) {
			Engine.Canvas.Context.fillStyle = col;
		}
		Engine.Canvas.Context.fillRect(x, y, w, h);
	},
	Circle: function(x, y, r, col) {
		if (col.length > 0) {
			Engine.Canvas.Context.fillStyle = col;
		}

		Engine.Canvas.Context.beginPath();
		Engine.Canvas.Context.arc(x, y, r, 0, 2 * Math.PI);
		// Engine.Canvas.Context.stroke();
		Engine.Canvas.Context.fill();
	},
	Text: function(text, x, y, font, size, col) { //the text, x position, y position, font (arial, verdana etc), font size and colour
		if (col.length > 0) { //if you have included a colour
			Engine.Canvas.Context.fillStyle = col; //add the colour!
		}
		Engine.Canvas.Context.font = size + "px " + font;
		Engine.Canvas.Context.fillText(text,x,y);
	},
	Pattern: function(x, y, w, h, src) {
		var img = new Image();
		img.src = src;
		var pattern = Engine.Canvas.Context.createPattern(img, 'repeat');
		Engine.Canvas.Context.fillStyle = pattern;
		Engine.Canvas.Context.fillRect(x, y, w, h);
	}
};

//BROWSER ANIMATION PACKS
//--------------------------------------------------------------------------/
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
		function(callback, element) {
			fpsLoop = window.setTimeout(callback, 1000 / 60);
		};
}());

window.onload = Engine.Init(); // Engine stars on load