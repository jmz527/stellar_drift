var Engine = { //the main Engine object
	/** variables **/
	Player: { //the player object
		Coins: 0, //how many coins that player has
		PerClick: 1, //how many coins per click
		PerIncrement: 0, //how many coins per timed increment
		Increment: 2000 //how long the increment is (2secs)
	},
	Canvas: { //the canvas object
		Element: null, //this will be a canvas element
		Context: null //this will become a 2d context
	},
	
	/** functions **/
	Init: function() { //an inner function "init"
		Engine.Canvas = document.createElement('canvas'); //create a canvas element
		Engine.Canvas.id = "display"; //give it an id to reference later
		Engine.Canvas.width = 800; //the width
		Engine.Canvas.height = 600; //the height
		$('body').append(Engine.Canvas); //finally append the canvas to the page
		
		Engine.Canvas.Context = Engine.Canvas.getContext('2d'); //set the canvas to render in 2d.
		Engine.GameLoop(); //start rendering the game!
	},
	
	/** animation routines **/
	GameRunning: null, //this is a new variable so we can pause/stop the game
	Update: function() { //this is where our logic gets updated
		Engine.Draw(); //call the canvas draw function
	},
	Draw: function() { //this is where we will draw all the information for the game!
		Engine.Canvas.Context.clearRect(0,0,Engine.Canvas.width,Engine.Canvas.height); //clear the frame
		Engine.Rect(50, 64, 128, 32, "red"); //use the Engine.Rect() function to draw a red block!
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