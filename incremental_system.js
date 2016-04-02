var Engine = { //the main Engine object
	/** variables **/
	Info: { //the engine info
		Version: 0.13 //engine version number
	},
	Player: { //the player object
		Clicks: 0, //how many clicks
		Coins: 0, //how many coins that player has
		PerClick: 1, //how many coins per click
		PerIncrement: 0, //how many coins per timed increment
		Increment: 2000 //how long the increment is (2secs)
	},
	StatusMessage: "", //status message
	Canvas: { //the canvas object
		Element: null, //this will be a canvas element
		Context: null //this will become a 2d context
	},
	Timers: { //this holds all sorts of timers
		Increment: null, //this is the main coin increment,
		StatusMessage: null, //this is so we can reset the status message timer
	},
	
	/** upgrade **/
	Upgrades: [ //the upgrades array 
		{ Name: "+1 Click", Cost: 10, Bought: false, PerClick: 1, PerIncrement: 0, Increment: 0 },
		{ Name: "+1 Inc.", Cost: 50, Bought: false, PerClick: 0, PerIncrement: 1, Increment: 0 },
		{ Name: "+1 Click", Cost: 75, Bought: false, PerClick: 1, PerIncrement: 0, Increment: 0 },
		{ Name: "-0.5sec", Cost: 100, Bought: false, PerClick: 0, PerIncrement: 0, Increment: 500 },
		{ Name: "-0.5sec", Cost: 150, Bought: false, PerClick: 0, PerIncrement: 0, Increment: 500 },
		{ Name: "+2 Inc.", Cost: 300, Bought: false, PerClick: 0, PerIncrement: 2, Increment: 0 },
		{ Name: "-0.5sec", Cost: 350, Bought: false, PerClick: 0, PerIncrement: 0, Increment: 500 },
	],

	ClickParticles: [],

	/** achievements **/
	Achievements: [ //the achievements array (name, how many clicks to earn and the reward)
		{ Name: "Small Clicker", Clicks: 25, Reward: 0 },
		{ Name: "Medium Clicker", Clicks: 50, Reward: 0 },
		{ Name: "Large Clicker", Clicks: 100, Reward: 50 }
	],
	
	/** images **/
	Images: { //the images object
		Background: { File: "assets/img/background.jpg", x: 0, y: 0, w: 800, h: 600, Image: new Image() }, //background image
		ClickArea: { File: "assets/img/clickarea.png", w: 128, h: 128, Image: new Image() }, //click area target
	},
	
	/** elements **/
	Elements: { //this holds the elements
		ClickBox: { //this is our main click element
			x: 320, y: 180, //position
			w: 128, h: 128 //size
		},
		UpgradeButtons: { //no position because it's hard coded
			w: 128, h: 33
		},
		Save: { //this is our main save element
			x: 16, y: 350, //position
			w: 84, h: 64  //size
		},
		Load: { //this is our main load element
			x: 16, y: 440, //position
			w: 84, h: 64  //size
		},
		Reset: { //this is our main load element
			x: 16, y: 530, //position
			w: 84, h: 64  //size
		}
	},
	
	/** functions **/
	Init: function() { //an inner function "init"
		Engine.Canvas = document.createElement('canvas'); //create a canvas element
		Engine.Canvas.id = "display"; //give it an id to reference later
		Engine.Canvas.width = 800; //the width
		Engine.Canvas.height = 600; //the height
		$('body').append(Engine.Canvas); //finally append the canvas to the page
		
		if (window.localStorage.getItem("incremental-player")) { //does a save exist
			Engine.Load(); //yep! load it!
		}
		
		Engine.LoadImages(); //load all the images
		Engine.AddClick(); //start the main click event
		Engine.StartIncrement(); //start the auto coins		
		Engine.Canvas.Context = Engine.Canvas.getContext('2d'); //set the canvas to render in 2d.
		Engine.GameLoop(); //start rendering the game!
		
	},
	LoadImages: function() { //load image function
		Engine.Images.Background.Image.src = Engine.Images.Background.File; //load background image
		Engine.Images.ClickArea.Image.src = Engine.Images.ClickArea.File; //load click area image
	},
	IncreaseCoins: function(amount) { //the new coin adding function
		Engine.Player.Coins += amount; //increase coins by amount
		Engine.CheckAchievements(); //check achievements
	},
	CheckAchievements: function() {
		for (var a = 0; a < Engine.Achievements.length; a++) { //loop through each achievement in the array
			if (Engine.Achievements[a].Clicks == Engine.Player.Clicks) { //have you matched the achievement clicks?
				Engine.Status("GOT ACHIEVEMENT: " + Engine.Achievements[a].Name); //show message with achievement name
			}
		}
	},
	Status: function(txt) { //show status function
		Engine.StatusMessage = txt; //assign the text
		clearTimeout(Engine.Timers.StatusMessage); //clear the timeout
		Engine.Timers.StatusMessage = setTimeout(function() { //reset the timeout
			Engine.StatusMessage = ""; //set the status back to nothing
			clearTimeout(Engine.Timers.StatusMessage); //clear it
			Engine.Timers.StatusMessage = null; //set to null for completeness
		}, 3000);
	},
	BuyUpgrade: function(ind) { //buy an upgrade
		var thisCost = Engine.Upgrades[ind].Cost; //assign cost
		var thisIncrement = Engine.Upgrades[ind].Increment; //assign increment time
		var thisName = Engine.Upgrades[ind].Name; //assign name
		var thisPerClick = Engine.Upgrades[ind].PerClick; //assign per click
		var thisPerIncrement = Engine.Upgrades[ind].PerIncrement; //assign per increment
		if (Engine.Player.Coins >= thisCost) { //does the player have enough coins
			Engine.Player.Coins -= thisCost; //take the coins
			Engine.Upgrades[ind].Bought = true; //set the item as "bought"
			if (thisIncrement > 0) { //if the increment is available
				clearInterval(Engine.Timers.Increment); //clear timer
				Engine.Timers.Increment = null; //set to null
				Engine.Player.Increment -= thisIncrement; //change time
				Engine.StartIncrement(); //start timer again
			}
			if (thisPerClick > 0) { //if the per click is available
				Engine.Player.PerClick += thisPerClick; //increase the per click
			}
			if (thisPerIncrement > 0) { //if the per increment is available
				Engine.Player.PerIncrement += thisPerIncrement; //increase the per increment
			}
			Engine.Status("UPGRADED: " + thisName); //show "UPGRADED: NAME"
		} else {
			Engine.Status("NOT ENOUGH COINS!"); //not enough coins!
		}
	},
	Save: function() { //save function
		window.localStorage.setItem("incremental-info", JSON.stringify(Engine.Info)); //set localstorage for engine info
		window.localStorage.setItem("incremental-player", JSON.stringify(Engine.Player)); //set localstorage for player
		window.localStorage.setItem("incremental-upgrades", JSON.stringify(Engine.Upgrades)); //set localstorage for upgrades
		Engine.Status("Saved!"); //show status message
	},
	Load: function() { //load function
		if (window.localStorage.getItem("incremental-info")) {
			var version = JSON.parse(window.localStorage.getItem("incremental-info"));
			if (version.Version <= Engine.Info.Version) {
				Engine.Player = JSON.parse(window.localStorage.getItem("incremental-player")); //load player
				Engine.Upgrades = JSON.parse(window.localStorage.getItem("incremental-upgrades")); //load upgrades
				Engine.Save(); //resave the new versioned data
				Engine.Info = JSON.parse(window.localStorage.getItem("incremental-info"));
				Engine.Status("Loaded!"); //show status message
			} else if (version.Version > Engine.Info.Version) {
				Engine.Status("ERROR: Your save file is newer than the game, please reset.");
			} else {
				Engine.Info = JSON.parse(window.localStorage.getItem("incremental-info"));
				Engine.Player = JSON.parse(window.localStorage.getItem("incremental-player")); //load player
				Engine.Upgrades = JSON.parse(window.localStorage.getItem("incremental-upgrades")); //load upgrades
				Engine.Status("Your save file is old, please resave!");
			}
		} else {
			Engine.Status("No save game present or old save file"); //no save game
		}
	},
	Reset: function() { //delete save function
		var areYouSure = confirm("Are you sure?\r\nYOU WILL LOSE YOUR SAVE!!"); //make sure the user is aware
		if (areYouSure == true) { //if they click yep
			window.localStorage.setItem("incremental-info", null); //delete
			window.localStorage.setItem("incremental-player", null); //delete
			window.localStorage.setItem("incremental-upgrades", null); //delete
			window.localStorage.removeItem("incremental-info"); //delete
			window.localStorage.removeItem("incremental-player"); //delete
			window.localStorage.removeItem("incremental-upgrades"); //delete
			window.location.reload(); //refresh page to restart
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
					var x = Math.floor(Math.random() * 128) + 320; //get a random x
					var y = Math.floor(Math.random() * 64) + 244; //get a random y
					Engine.ClickParticles.push({ x:x, y:y, o:10.0 }); //push the particle into the array
					Engine.IncreaseCoins(Engine.Player.PerClick); //call coin increase
				}
			} 
			if (m.pageX >= 670 && m.pageX <= 798) { //hardcoded upgrade area
				if (m.pageY >= Engine.Elements.UpgradeButtons.h && m.pageY <= Engine.Elements.UpgradeButtons.h + (Engine.Upgrades.length * Engine.Elements.UpgradeButtons.h)) { //clicked within the area
					var num = m.pageY - Engine.Elements.UpgradeButtons.h; //get the offset from the top
					var hitButton = num.roundTo(Engine.Elements.UpgradeButtons.h); //round the number to the nearest height
					Engine.BuyUpgrade((hitButton / Engine.Elements.UpgradeButtons.h) - 1); //final calculation to get the index you've clicked on
				}
			} 
			if (m.pageX >= Engine.Elements.Save.x && m.pageX <= (Engine.Elements.Save.x + Engine.Elements.Save.w)) { //save button
				if (m.pageY >= Engine.Elements.Save.y && m.pageY <= (Engine.Elements.Save.y + Engine.Elements.Save.h)) {
					Engine.Save(); //save
				}
			} 
			if (m.pageX >= Engine.Elements.Load.x && m.pageX <= (Engine.Elements.Load.x + Engine.Elements.Load.w)) { //loadbutton
				if (m.pageY >= Engine.Elements.Load.y && m.pageY <= (Engine.Elements.Load.y + Engine.Elements.Load.h)) {
					Engine.Load(); //load
				}
			} 
			if (m.pageX >= Engine.Elements.Reset.x && m.pageX <= (Engine.Elements.Reset.x + Engine.Elements.Reset.w)) { //resetbutton
				if (m.pageY >= Engine.Elements.Reset.y && m.pageY <= (Engine.Elements.Reset.y + Engine.Elements.Reset.h)) {
					Engine.Reset(); //reset
				}
			}
			return false;
		});
	},
	
	/** animation routines **/
	GameRunning: null, //this is a new variable so we can pause/stop the game
	Update: function() { //this is where our logic gets updated
		for (var p = 0; p < Engine.ClickParticles.length; p++) { //loop through particles
			Engine.ClickParticles[p].y--; //move up by 1px
			Engine.ClickParticles[p].o -= 0.1; //reduce opacity by 0.1
			if (Engine.ClickParticles[p].o <= 0.0) { //if it's invisible
				Engine.ClickParticles.splice(p,1); //remove the particle from the array
			}
		}
		Engine.Draw(); //call the canvas draw function
	},
	Draw: function() { //this is where we will draw all the information for the game!
		Engine.Canvas.Context.clearRect(0,0,Engine.Canvas.width,Engine.Canvas.height); //clear the frame
		
		/** background **/
		Engine.Image(Engine.Images.Background.Image, Engine.Images.Background.x, Engine.Images.Background.y, Engine.Images.Background.w, Engine.Images.Background.h, 1); //background image drawing
		
		/** click button! **/
		Engine.Image(Engine.Images.ClickArea.Image, Engine.Elements.ClickBox.x, Engine.Elements.ClickBox.y, Engine.Images.ClickArea.w, Engine.Images.ClickArea.h, 0.75); //click area image drawing
		Engine.Text("Click me", 332, 330, "Gloria Hallelujah", 27, "#333", 1); //click button text

		/** particles **/
		for (var p = 0; p < Engine.ClickParticles.length; p++) {
			Engine.Text("+" + Engine.Player.PerClick, Engine.ClickParticles[p].x, Engine.ClickParticles[p].y, "Arial", 32, "blue", Engine.ClickParticles[p].o);
		}

		/** display/hud **/
		Engine.Text(Engine.Player.Coins + " Coins", 16, 32, "Gloria Hallelujah", 20, "#333", 1); //coin display
		Engine.Text(Engine.Player.PerClick + " Coins per click", 16, 56, "Gloria Hallelujah", 20, "#333", 1); //per click display
		Engine.Text(Engine.Player.PerIncrement + " Coins every " + (Engine.Player.Increment / 1000) + "secs", 16, 80, "Gloria Hallelujah", 20, "#333", 1); //increment display
		Engine.Text(Engine.StatusMessage, 16, 104, "Gloria Hallelujah", 20, "orange", 1); //new status message
		
		//render upgrades
		Engine.Text("Upgrades:", 675, 20, "Gloria Hallelujah", 20, "#333", 1); //show the title
		for (var u = 0; u < Engine.Upgrades.length; u++) { //loop through the upgrades
			if (Engine.Upgrades[u].Bought == false) { //has the player bought the item?
				Engine.Rect(670, Engine.Elements.UpgradeButtons.h * (u+1), Engine.Elements.UpgradeButtons.w, 32, "lightgreen", 0.5); //display a "button"
				Engine.Text(Engine.Upgrades[u].Name + " (Cost: " + Engine.Upgrades[u].Cost + ")", 674, 22 + (Engine.Elements.UpgradeButtons.h * (u + 1)), "Gloria Hallelujah", 12, "#333", 1); //put text over that button
			} else {
				Engine.Rect(670, Engine.Elements.UpgradeButtons.h * (u+1), Engine.Elements.UpgradeButtons.w, 32, "silver", 0.5); //display a "button"
				Engine.Text(Engine.Upgrades[u].Name + " (BOUGHT)", 674, 22 + (Engine.Elements.UpgradeButtons.h * (u + 1)), "Gloria Hallelujah", 12, "#333", 1); //put text over that button
			}
		}
		
		//save button
		Engine.Rect(Engine.Elements.Save.x, Engine.Elements.Save.y, Engine.Elements.Save.w, Engine.Elements.Save.h, "silver", 0.5); //display a "button"
		Engine.Text("Save", Engine.Elements.Save.x + 25, Engine.Elements.Save.y + 38, "Gloria Hallelujah", 18, "#111", 1); //put text over that button
		
		//load button
		Engine.Rect(Engine.Elements.Load.x, Engine.Elements.Load.y, Engine.Elements.Load.w, Engine.Elements.Load.h, "silver", 0.5); //display a "button"
		Engine.Text("Load", Engine.Elements.Load.x + 25, Engine.Elements.Load.y + 38, "Gloria Hallelujah", 18, "#111", 1); //put text over that button
		
		//reset button
		Engine.Rect(Engine.Elements.Reset.x, Engine.Elements.Reset.y, Engine.Elements.Reset.w, Engine.Elements.Reset.h, "silver", 0.5); //display a "button"
		Engine.Text("Reset", Engine.Elements.Reset.x + 22, Engine.Elements.Reset.y + 38, "Gloria Hallelujah", 18, "#111", 1); //put text over that button
		
		Engine.GameLoop(); //re-iterate back to gameloop
	},
	GameLoop: function() { //the gameloop function
		Engine.GameRunning = setTimeout(function() { 
			requestAnimFrame(Engine.Update, Engine.Canvas);  //call animation frame
		}, 1);
	},
	
	/** drawing routines **/
	Image: function(img,x,y,w,h,opac) { //image drawing function, x position, y position, width, height and opacity
		if (opac) { //if opacity exists
			Engine.Canvas.Context.globalAlpha = opac; //amend it
		}
		Engine.Canvas.Context.drawImage(img,x,y,w,h); //draw image
		Engine.Canvas.Context.globalAlpha = 1.0; //reset opacity
	},
	Rect: function(x,y,w,h,col,opac) { //x position, y position, width, height and colour
		if (col.length > 0) { //if you have included a colour
			Engine.Canvas.Context.fillStyle = col; //add the colour!
		}
		if (opac > 0) { //if opacity exists
			Engine.Canvas.Context.globalAlpha = opac; //reset opacity
		}
		Engine.Canvas.Context.fillRect(x,y,w,h); //draw the rectangle
		Engine.Canvas.Context.globalAlpha = 1.0;
	},
	Text: function(text,x,y,font,size,col,opac) { //the text, x position, y position, font (arial, verdana etc), font size and colour
		if (col.length > 0) { //if you have included a colour
			Engine.Canvas.Context.fillStyle = col; //add the colour!
		}
		if (opac > 0) { //if opacity exists
			Engine.Canvas.Context.globalAlpha = opac; //amend it
		}
		Engine.Canvas.Context.font = size + "px " + font; //set font style
		Engine.Canvas.Context.fillText(text,x,y); //show text
		Engine.Canvas.Context.globalAlpha = 1.0; //reset opacity
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

Number.prototype.roundTo = function(num) { //new rounding function
	var resto = this%num;
	return this+num-resto; //return rounded down to nearest "num"
}

window.onload = Engine.Init(); //the engine starts when window loads