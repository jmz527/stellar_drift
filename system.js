var Engine = { //the main Engine object
	/** variables **/
	Player: { //the player object
		Clicks: 0, //how many clicks
		Coins: 0, //how many coins that player has
		PerClick: 1, //how many coins per click
		PerIncrement: 0, //how many coins per timed increment
		Increment: 2000 //how long the increment is (2secs)
	},
	StatusMessage: "",
	Canvas: { //the canvas object
		Element: null, //this will be a canvas element
		Context: null //this will become a 2d context
	},
	Timers: { //this holds all sorts of timers
		Increment: null, //this is the main coin increment,
		StatusMessage: null, //this is so we can reset the status message timer
	},
	
	/** achievements **/
	Achievements: [ //the achievements array (name, how many clicks to earn and the reward)
		{ Name: "Small Clicker", Clicks: 25, Reward: 0 },
		{ Name: "Medium Clicker", Clicks: 50, Reward: 0 },
		{ Name: "Large Clicker", Clicks: 100, Reward: 50 }
	],
	
	/** elements **/
	Elements: { //this holds the elements
		ClickBox: { //this is our main click element
			x: 320, y: 180, //position
			w: 128, h: 128 //size
		}
	},
	
	/** functions **/
	Init: function() { //an inner function "init"
		Engine.Canvas = document.createElement('canvas'); //create a canvas element
		Engine.Canvas.id = "display"; //give it an id to reference later
		Engine.Canvas.width = 800; //the width
		Engine.Canvas.height = 600; //the height
		$('body').append(Engine.Canvas); //finally append the canvas to the page
		
		Engine.AddClick(); //start the main click event
		Engine.StartIncrement(); //start the auto coins		
		Engine.Canvas.Context = Engine.Canvas.getContext('2d'); //set the canvas to render in 2d.
		Engine.GameLoop(); //start rendering the game!
		
	},
	IncreaseCoins: function(amount) { //the new coin adding function
		Engine.Player.Coins += amount; //increase coins by amount
		Engine.CheckAchievements(); //check achievements
	},
	CheckAchievements: function() {
		for (var a = 0; a < Engine.Achievements.length; a++) { //loop through each achievement in the array
			if (Engine.Achievements[a].Clicks == Engine.Player.Clicks) { //have you matched the achievement clicks?
				Engine.StatusMessage = "GOT ACHIEVEMENT: " + Engine.Achievements[a].Name; //show message with achievement name
				clearTimeout(Engine.Timers.StatusMessage); //clear the current timeout
				Engine.Timers.StatusMessage = setTimeout(function() { //assign a new one
					Engine.StatusMessage = ""; //reset message after 3 seconds
					clearTimeout(Engine.Timers.StatusMessage);
					Engine.Timers.StatusMessage = null;
				}, 3000); //3 secs
			}
		}
	},
	
	/** event handlers **/
	StartIncrement: function() { //automatic coins
		Engine.Timers.Increment = setInterval(function() { //set the Timer as an interval
			Engine.IncreaseCoins(Engine.Player.PerIncrement); //call coin increase
		}, Engine.Player.Increment); //set to the players increment time
	},
	AddClick: function() { //the click function
		$(Engine.Canvas).on('click', function(m) { //we add a click to the Engine.Canvas object (note the 'm')
			if (m.pageX >= Engine.Elements.ClickBox.x && m.pageX <= (Engine.Elements.ClickBox.x + Engine.Elements.ClickBox.w)) { //check to see if the click is within the box X co-ordinates
				if (m.pageY >= Engine.Elements.ClickBox.y && m.pageY <= (Engine.Elements.ClickBox.y + Engine.Elements.ClickBox.h)) { //check to see if the click is within the box Y co-ordinates
					Engine.Player.Clicks++; //add a click
					Engine.IncreaseCoins(Engine.Player.PerClick); //call coin increase
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
		
		/** click button! **/
		Engine.Rect(Engine.Elements.ClickBox.x, Engine.Elements.ClickBox.y, Engine.Elements.ClickBox.w, Engine.Elements.ClickBox.h, "silver"); //use the Rect function to draw the click button!
		Engine.Text("CLICK ME", 330, 210, "Calibri", 28, "orange"); //click button text
		
		/** display/hud **/
		Engine.Text(Engine.Player.Coins + " Coins", 16, 32, "Calibri", 20, "blue"); //coin display
		Engine.Text(Engine.Player.PerClick + " Coins per click", 16, 56, "Calibri", 20, "blue"); //per click display
		Engine.Text(Engine.Player.PerIncrement + " Coins every " + (Engine.Player.Increment / 1000) + "secs", 16, 80, "Calibri", 20, "blue"); //increment display
		Engine.Text(Engine.StatusMessage, 16, 104, "Calibri", 20, "orange"); //new status message
		
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