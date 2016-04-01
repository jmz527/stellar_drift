;(function() {

// GAME
//--------------------------------------------------------------------------/
	var Game = function(canvasID) {
		var canvas = document.getElementById(canvasID);
		var screen = canvas.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height };
		var self = this;

		this.ships = [new Player(this, gameSize)];
		this.planets = [new Sun(this, gameSize)];

		loadSound("assets/audio/shoot.mp3", function(shootSound) {
			self.shootSound = shootSound;
			var tick = function() {
				self.update();
				self.draw(screen, gameSize);
				requestAnimationFrame(tick);
			}

			tick();
		});
	};

	Game.prototype = {
		update: function() {
			var ships = this.ships;
			var notCollidingWithAnything = function(b1) {
				return ships.filter(function(b2) { return colliding(b1, b2); }).length === 0;
			}

			this.ships = this.ships.filter(notCollidingWithAnything);

			for (var i = 0; i < this.ships.length; i++) {
				this.ships[i].update();
			};
		},

		draw: function(screen, gameSize) {
			screen.clearRect(0, 0, gameSize.x, gameSize.y);

			for (var i = 0; i < this.planets.length; i++) {
				drawCircle(screen, this.planets[i]);
			};

			for (var i = 0; i < this.ships.length; i++) {
				drawRect(screen, this.ships[i]);
			};
		},

		addBody: function(body) {
			this.ships.push(body);
		}
	};

// GAME PIECES
//--------------------------------------------------------------------------/
	var Sun = function(game, gameSize) {
		this.game = game;
		this.size = { x: 300, y: 300 };
		this.center = { x: gameSize.x /2, y: 0 };
	};

	Sun.prototype = {
		update: function() {}
	}

	var Player = function(game, gameSize) {
		this.game = game;
		this.size = { x: 15, y: 15 };
		this.center = { x: gameSize.x /2, y: gameSize.y - this.size.x };
		this.Keyboarder = new Keyboarder();
	};

	Player.prototype = {
		update: function() {
			if (this.Keyboarder.isDown(this.Keyboarder.KEYS.LEFT) || this.Keyboarder.isDown(this.Keyboarder.KEYS.A)) {
				this.center.x -= 2;
			} else if (this.Keyboarder.isDown(this.Keyboarder.KEYS.UP) || this.Keyboarder.isDown(this.Keyboarder.KEYS.W)) {
				this.center.y -= 2;
			} else if (this.Keyboarder.isDown(this.Keyboarder.KEYS.RIGHT) || this.Keyboarder.isDown(this.Keyboarder.KEYS.D)) {
				this.center.x += 2;
			} else if (this.Keyboarder.isDown(this.Keyboarder.KEYS.DOWN) || this.Keyboarder.isDown(this.Keyboarder.KEYS.S)) {
				this.center.y += 2;
			}

			if (this.Keyboarder.isDown(this.Keyboarder.KEYS.SPACE)) {
				var laser = new Laser({ x: this.center.x, y: this.center.y - this.size.x / 2},
										{ x: 0, y: -6 });
				this.game.addBody(laser);
				this.game.shootSound.load();
				this.game.shootSound.play();
			}
		}
	};

	var Laser = function(center, velocity) {
		this.size = { x: 3, y: 3 };
		this.center = center;
		this.velocity = velocity;
	};

	Laser.prototype = {
		update: function() {
			this.center.x += this.velocity.x;
			this.center.y += this.velocity.y;
		}
	};

// SHAPES
//--------------------------------------------------------------------------/
	var drawRect = function(screen, body) {
		screen.fillStyle = "#fff";
		screen.fillRect(body.center.x - body.size.x / 2,
						body.center.y - body.size.y / 2,
						body.size.x, body.size.y);
	};

	var drawCircle = function(screen, planet) {
		var circle = new Path2D();
		circle.arc(planet.center.x - planet.size.x / 2, 150, 25, 0, 2 * Math.PI);
		screen.fillStyle = "yellow";
		screen.fill(circle);
	}

// INTERACTIONS
//--------------------------------------------------------------------------/
	var colliding = function(b1, b2) {
		return !(b1 === b2 ||
				 b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
				 b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
				 b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
				 b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
	};

// KEYBOARDER
//--------------------------------------------------------------------------/
	var Keyboarder = function() {
		var keyState = {};

		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		};

		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		};

		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		};

		this.KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, A: 65, W: 87, D: 68, S: 83, SPACE: 32 };
	};

// AUDIO
//--------------------------------------------------------------------------/
	var loadSound = function(url, callback) {
		var loaded = function() {
			callback(sound);
			sound.removeEventListener('canplaythrough', loaded);
		};

		var sound = new Audio(url);
		sound.addEventListener('canplaythrough', loaded);
		sound.load();
	}

// INIT
//--------------------------------------------------------------------------/
	window.onload = function() {
		new Game("screen");
	};


})();