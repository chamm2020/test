

/**
 * [Enemy Base class of an enemy. All enemies will extend this class]
 * @param {[type]} x     [Initial x position of enemy]
 * @param {[type]} y     [Initial y position of enemy]
 * @param {[type]} level [Initial level of enemy]
 * @constructor
 */
var Enemy = function(x, y, level) {
	this.x = x;  // x position on canvas
	this.y = y;  // y position on canvas
	this.level = level;
	this.hp = 10 * level;
	this.xp = 100 * level;
	this.movementSpeed = level * 25;
	this.attackSpeed = level;
	this.attack = level;
	this.defense = level;
	this.scout = level * 1.25;
	this.magic = level;
	this.initiative = 10;
	this.turnCounter = 0;  // Determines when the enemy should perform its turn
	this.watchedElements = [];
	this.counter = 0;
	this.moveSpeed = 4;         // How fast the enemy moves on the screen.
								// moveSpeed is different from movementSpeed as movementSpeed determines how far
								// the enemy moves per turn.

	var maxHp = this.hp;  // never changes once initialized

	this.healthBarMaxWidth = 18;
	this.healthBar = new createjs.Bitmap("../graphics/health_bar.png");
	this.healthBar.scaleX = this.healthBarMaxWidth / this.healthBar.image.width;
	this.healthBar.x = this.x - 16;
	this.healthBar.y = this.y - 5;


	/**
	 * [doMovement This function will be inherited by child classes that handle how the enemy moves]
	 */
	this.doMovement = function() {
	};

	/**
	 * [getNearestPlayer Finds the player on the gamestage that is closest to this enemy]
	 * @return {[Player]} [The nearest player to this enemy]
	 */
	this.getNearestPlayer = function() {
		var leastDistance = -1;
		var nearestPlayer;

		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i] instanceof Player) {
				var dx = Math.abs(activeObjects[i].x - this.x);
				var dy = Math.abs(activeObjects[i].y - this.y);
				var distance = dy + dx;

				if (leastDistance === -1 || leastDistance > distance) {
					leastDistance = distance;
					nearestPlayer = activeObjects[i];
				}
			}
		}

		return nearestPlayer;
	};

	/**
	 * [turn code that gets called when it's the enemy's turn]
	 * @return {[type]} [description]
	 */
	this.turn = function() {
		if (!this.isWithinMaxDistance()) {
			this.turnCounter = 0;
			return;
		}

		this.doMovement();
	};

	/**
	 * [isWithinMaxDistance checks whether or not the enemy is within the max distance from a player]
	 * @return {Boolean} [description]
	 */
	this.isWithinMaxDistance = function() {
		for (var i = 0; i < activeObjects.length; i++) {
			if (activeObjects[i].constructor === Player) {
				var dx = Math.abs(activeObjects[i].x - this.x);
				var dy = Math.abs(activeObjects[i].y - this.y);
				var distance = Math.sqrt(dy + dx);

				if (distance < MAX_ENEMY_DISTANCE) {
					return true;
				}
			}
		}

		return false;
	}

	/**
	 * [receiveDamage Reduces this enemy's hp by the amount of damage received and updates health bar]
	 * @param  {[type]} amount [The amount of damage to be taken]
	 */
	this.receiveDamage = function(amount) {
		this.hp -= amount;

		if (this.hp <= 0) {
			this.die();
			return;
		}

		var newHealthBarWidth = this.healthBarMaxWidth * (this.hp / maxHp);

		if (this.hp / maxHp < 0.2) {  // less than 20% hp, make the health bar red
			this.animations.removeChild(this.healthBar);
			this.healthBar = new createjs.Bitmap("../graphics/health_bar_red.png");
			this.healthBar.x = this.x - 16;
			this.healthBar.y = this.y - 5;
			this.animations.addChild(this.healthBar);
		}

		if (newHealthBarWidth == 0)
			newHealthBarWidth = 1;

		this.healthBar.scaleX = newHealthBarWidth / this.healthBar.image.width;
	};

	/**
	 * [die Kills this enemy, removing the enemy from activeObjects and the gamestage]
	 */
	this.die = function() {
		renderer.activeObjectsContainer.removeChild(this.animations);
		var index = activeObjects.indexOf(this);

		if (index > -1) {
			activeObjects.splice(index, 1);
		}
	};

	/**
	 * [tickActions Keeps track of watchedElements and what the enemy should be doing]
	 */
	this.tickActions = function() {
		for (var i = 0; i < this.watchedElements.length; i++) {
			this.watchedElements[i].tickActions(); // tick watched elements
		}

		this.counter++;
	};

	/**
	 * [cleanUpMovement Gets called after enemy has finished moving]
	 */
	this.cleanUpMovement = function() {
		this.turnCounter = 0;
	};
};

Enemy.prototype = new ComplexObject;
Enemy.prototype.constructor = Enemy;