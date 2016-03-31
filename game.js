;(function() {
	// Game constructor
	var Game = function(canvasID) {
		var canvas = document.getElementById(canvasID);
		var screen = canvas.getContext('2d');
		var gameSize = { x: canvas.width, y: canvas.height };
		var self = this;

		this.bodies = [new Player(this, gameSize)];

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
			var bodies = this.bodies;
			var notCollidingWithAnything = function(b1) {
				return bodies.filter(function(b2) { return colliding(b1, b2); }).length === 0;
			}

			this.bodies = this.bodies.filter(notCollidingWithAnything);

			for (var i = 0; i < this.bodies.length; i++) {
				this.bodies[i].update();
			};
		},

		draw: function(screen, gameSize, sun) {
			screen.clearRect(0, 0, gameSize.x, gameSize.y);

			for (var i = 0; i < this.bodies.length; i++) {
				drawRect(screen, this.bodies[i]);
			};
		},

		addBody: function(body) {
			this.bodies.push(body);
		}
	};

	// var Sun = function(game, gameSize) {
	// 	this.game = game;
	// 	this.size = { x: 300, y: 300 };
	// 	this.center = { x: 0, y: 0 };
	// 	this.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
	// };

	// Sun.prototype = {
	// 	update: function() {}
	// }

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
				var bullet = new Bullet({ x: this.center.x, y: this.center.y - this.size.x / 2},
										{ x: 0, y: -6 });
				this.game.addBody(bullet);
				this.game.shootSound.load();
				this.game.shootSound.play();
			}
		}
	};

	var Bullet = function(center, velocity) {
		this.size = { x: 3, y: 3 };
		this.center = center;
		this.velocity = velocity;
	};

	Bullet.prototype = {
		update: function() {
			this.center.x += this.velocity.x;
			this.center.y += this.velocity.y;
		}
	};

	var drawRect = function(screen, body) {
		screen.fillRect(body.center.x - body.size.x / 2,
						body.center.y - body.size.y / 2,
						body.size.x, body.size.y);
	};

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

	var colliding = function(b1, b2) {
		return !(b1 === b2 ||
				 b1.center.x + b1.size.x / 2 < b2.center.x - b2.size.x / 2 ||
				 b1.center.y + b1.size.y / 2 < b2.center.y - b2.size.y / 2 ||
				 b1.center.x - b1.size.x / 2 > b2.center.x + b2.size.x / 2 ||
				 b1.center.y - b1.size.y / 2 > b2.center.y + b2.size.y / 2);
	};

	var loadSound = function(url, callback) {
		var loaded = function() {
			callback(sound);
			sound.removeEventListener('canplaythrough', loaded);
		};

		var sound = new Audio(url);
		sound.addEventListener('canplaythrough', loaded);
		sound.load();
	}

	window.onload = function() {
		new Game("screen");
	};


})();