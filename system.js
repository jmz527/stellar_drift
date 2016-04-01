var Engine = { //the main Engine object
	/** variables **/
	Player: { //the player object
		Coins: 0, //how many coins that player has
		PerClick: 1, //how many coins per click
		PerIncrement: 1, //how many coins per timed increment
		Increment: 2000 //how long the increment is (2secs)
	},
	Canvas: { //the canvas object
		Element: null, //this will be a canvas element
		Context: null //this will become a 2d context
	},
	Timers: {
		Increment: null,
	},

	Elements: {
		ClickBox: {
			x: 320, y: 180,
			w: 128, h: 128
		}
	},
	
	/** functions **/
	Init: function() { //an inner function "init"
		Engine.Canvas = document.createElement('canvas'); //create a canvas element
		Engine.Canvas.id = "display"; //give it an id to reference later
		Engine.Canvas.width = 800; //the width
		Engine.Canvas.height = 600; //the height
		$('body').append(Engine.Canvas); //finally append the canvas to the page

		Engine.AddClick();
		Engine.StartIncrement();
		Engine.Canvas.Context = Engine.Canvas.getContext('2d'); //set the canvas to render in 2d.
		Engine.GameLoop(); //start rendering the game!
	},

	StartIncrement: function() {
		Engine.Timers.Increment = setInterval(function() {
			Engine.Player.Coins += Engine.Player.PerIncrement;
		}, Engine.Player.Increment);
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
	
	/** animation routines **/
	GameRunning: null, //this is a new variable so we can pause/stop the game
	Update: function() { //this is where our logic gets updated
		Engine.Draw(); //call the canvas draw function
	},
	Draw: function() { //this is where we will draw all the information for the game!
		Engine.Canvas.Context.clearRect(0,0,Engine.Canvas.width,Engine.Canvas.height); //clear the frame

		Engine.Rect(320, 180, 128, 128, "silver"); //click button
		Engine.Text("CLICK ME", 330, 210, "Calibri", 28, "orange"); //click button text

		Engine.Text(Engine.Player.Coins + " Coins", 16, 32, "Calibri", 20, "blue"); //coin display
		Engine.Text(Engine.Player.PerClick + " Coins per click", 16, 56, "Calibri", 20, "blue"); //per click display
		Engine.Text(Engine.Player.PerIncrement + " Coins every " + (Engine.Player.Increment / 1000) + "secs", 16, 80, "Calibri", 20, "blue"); //increment display

		Engine.GameLoop(); //re-iterate back to gameloop
	},
	GameLoop: function() { //the gameloop function
		Engine.GameRunning = setTimeout(function() { 
			requestAnimFrame(Engine.Update, Engine.Canvas); 
		}, 10);
	},
	
	/** drawing routines **/
	Rect: function(x,y,w,h,col) { //x position, y position, width, height and colour
		if (col.length > 0) { //if you have included a colour
			Engine.Canvas.Context.fillStyle = col; //add the colour!
		}
		Engine.Canvas.Context.fillRect(x,y,w,h); //draw the rectangle
	},
	Text: function(text, x, y, font, size, col) { //the text, x position, y position, font (arial, verdana etc), font size and colour
		if (col.length > 0) { //if you have included a colour
			Engine.Canvas.Context.fillStyle = col; //add the colour!
		}
		Engine.Canvas.Context.font = size + "px " + font;
		Engine.Canvas.Context.fillText(text,x,y);
	}
};
/** This is a request animation frame function that gets the best possible animation process for your browser, I won't go into specifics; just know it's worth using ;) **/
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
	function (callback, element){
		fpsLoop = window.setTimeout(callback, 1000 / 60);
	};
}());
window.onload = Engine.Init(); //the engine starts when window loads