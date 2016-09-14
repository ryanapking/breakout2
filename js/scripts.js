function Gameboard() {
  this.width = 400;
  this.paddle = new Paddle(this.width);
  this.ball = new Ball(this.width);
  this.currentLevel = new Level(this.width);
  this.level = 1;
};

Gameboard.prototype.repositionElements = function(timePassed) {
  this.paddle.repositionPaddle(timePassed);
  if (this.ball.stuck) {
    this.ballStuck();
  } else {
    this.repositionBall(timePassed);
  }
}

Gameboard.prototype.repositionBall = function(timePassed) {
  this.ball.newX = this.ball.x + this.ball.speed * this.ball.direction * timePassed / 1000;
  this.ball.newY = this.ball.y + this.ball.speed * this.ball.slope * timePassed / 1000;
  this.ball.setNewBounds();
  this.checkCollision();
  this.ball.x = this.ball.newX;
  this.ball.y = this.ball.newY;
  this.ball.setBounds();
};

Gameboard.prototype.checkCollision = function() {
  this.checkPaddleCollision();
  for (var i = 0; i < this.currentLevel.blocks.length; i++) {
    var x = this.currentLevel.blocks[i].x;
    var y = this.currentLevel.blocks[i].y;
    var x2 = this.currentLevel.blocks[i].x2;
    var y2 = this.currentLevel.blocks[i].y2;
    if (this.checkBallTop(x, y, x2, y2)) {
      this.ball.slope = -this.ball.slope;
      this.currentLevel.removeBlock(i);
      return;
    } else if (this.checkBallBottom(x, y, x2, y2)) {
      this.ball.slope = -this.ball.slope;
      this.currentLevel.removeBlock(i);
      return;
    } else if (this.checkBallRight(x, y, x2, y2)) {
      this.ball.direction = -this.ball.direction;
      this.currentLevel.removeBlock(i);
      return;
    } else if (this.checkBallLeft(x, y, x2, y2)) {
      this.ball.direction = -this.ball.direction;
      this.currentLevel.removeBlock(i);
      return;
    }
  }
  if (this.checkWallCollision()) {
    return;
  }
};

Gameboard.prototype.checkBallTop = function(x, y, x2, y2) {
  if (this.ball.newTopX > x && this.ball.newTopX < x2 && this.ball.newTopY > y && this.ball.newTopY < y2) {
    this.ball.newY = y2 + this.ball.radius;
    return true;
  } else {
    return false;
  }
};

Gameboard.prototype.checkBallBottom = function(x, y, x2, y2) {
  if (this.ball.newBottomX > x && this.ball.newBottomX < x2 && this.ball.newBottomY > y && this.ball.newBottomY < y2) {
    this.ball.newY = y - this.ball.radius;
    return true;
  } else {
    return false;
  }
};

Gameboard.prototype.checkBallRight = function(x, y, x2, y2) {
  if (this.ball.newRightX > x && this.ball.newRightX < x2 && this.ball.newRightY > y && this.ball.newRightY < y2) {
    this.ball.newX = x - this.ball.radius;
    return true;
  } else {
    return false;
  }
};

Gameboard.prototype.checkBallLeft = function(x, y, x2, y2) {
  if (this.ball.newLeftX > x && this.ball.newLeftX < x2 && this.ball.newLeftY > y && this.ball.newLeftY < y2) {
    this.ball.newX = x2 + this.ball.radius;
    return true;
  } else {
    return false;
  }
};

Gameboard.prototype.checkWallCollision = function() {
  if (this.ball.newLeftX < 0) {
    this.ball.newX = 0 + this.ball.radius;
    this.ball.direction = -this.ball.direction;
    return true;
  } else if (this.ball.newRightX > this.width) {
    this.ball.newX = this.width - this.ball.radius;
    this.ball.direction = -this.ball.direction;
    return true;
  }
  if (this.ball.newTopY < 0) {
    this.ball.newY = 0 + this.ball.radius;
    this.ball.slope = -this.ball.slope;
    return true;
  } else if (this.ball.newTopY > this.width) {
    this.ball = new Ball(this.width);
  }
  return false;
};

Gameboard.prototype.checkPaddleCollision = function() {
  var x = this.paddle.x;
  var y = this.paddle.y;
  var x2 = this.paddle.x2;
  var y2 = this.paddle.y2;
  if (this.checkBallBottom(x, y, x2, y2)) {
    this.ball.slope = -this.ball.slope;
    this.paddle.setInfluence(this.ball.newX);
    if (this.ball.direction > 0) {
      this.ball.direction += this.paddle.influence;
    } else {
      this.ball.direction -= this.paddle.influence;
    }
    console.log(this.ball.direction);
  }
};

Gameboard.prototype.ballStuck = function() {
  if (this.ball.stuck) {
    this.ball.x = this.paddle.x + (.5 * this.paddle.width);
    this.ball.y = this.paddle.y - this.ball.radius;
  }
};

function Ball(canvasWidth) {
  this.canvasWidth = canvasWidth;
  this.x = 200;
  this.y = 200;
  this.radius = this.canvasWidth / 100;
  this.topX = this.x;
  this.topY = this.y - this.radius;
  this.bottomX = this.x;
  this.bottomY = this.y + this.radius;
  this.rightX = this.x + this.radius;
  this.rightY = this.y;
  this.leftX = this.x - this.radius;
  this.leftY = this.y;
  this.newX = this.x;
  this.newY = this.y;
  this.newTopX = this.topX;
  this.newTopY = this.topY;
  this.newBottomX = this.bottomX;
  this.newBottomY = this.bottomY;
  this.newRightX = this.rightX;
  this.newRightY = this.rightY;
  this.newLeftX = this.leftX;
  this.newLeftY = this.leftY;
  this.speed = this.canvasWidth / 1.5;
  this.slope = -1;
  this.direction = .5;
  this.color = "lightgray";
  this.stuck = true;
  this.sideCollision = "right";
  this.topCollision = "top";
};

Ball.prototype.setBounds = function() {
  this.topX = this.x;
  this.topY = this.y - this.radius;
  this.bottomX = this.x;
  this.bottomY = this.y + this.radius;
  this.rightX = this.x + this.radius;
  this.rightY = this.y;
  this.leftX = this.x - this.radius;
  this.leftY = this.y;
};

Ball.prototype.setNewBounds = function() {
  this.newTopX = this.newX;
  this.newTopY = this.newY - this.radius;
  this.newBottomX = this.newX;
  this.newBottomY = this.newY + this.radius;
  this.newRightX = this.newX + this.radius;
  this.newRightY = this.newY;
  this.newLeftX = this.newX - this.radius;
  this.newLeftY = this.newY;
};

function Paddle(canvasWidth) {
  this.canvasWidth = canvasWidth;
  this.x = 0;
  this.y = (this.canvasWidth / 20) * 17;
  this.width = (this.canvasWidth / 20) * 3;
  this.height = this.canvasWidth / 40;
  this.x2 = this.x + this.width;
  this.y2 = this.y + this.height;
  this.speed = this.canvasWidth / 1.5;
  this.influence
  this.color = "gray";
  this.leftPressed = false;
  this.rightPressed = false;
};

Paddle.prototype.setInfluence = function(x) {
  x = x - this.x;
  var zoneSize = this.width / 7;
  if (x < zoneSize) {
    this.influence = .2;
  } else if (x < zoneSize * 2) {
    this.influence = .1;
  } else if (x < zoneSize * 3) {
    this.influence = 0;
  } else if (x < zoneSize * 4) {
    this.influence = -.1;
  } else if (x < zoneSize * 5) {
    this.influence = 0;
  } else if (x < zoneSize * 6) {
    this.influence = .1;
  } else if (x < zoneSize * 6) {
    this.influence = .2;
  }
};

Paddle.prototype.repositionPaddle = function(timePassed) {
  if (this.leftPressed && this.x > 0) {
    this.x -= (this.speed * (timePassed / 1000));
    this.x2 = this.x + this.width;
  } else if (this.rightPressed && this.x + this.width < this.canvasWidth) {
    this.x += (this.speed * (timePassed / 1000));
    this.x2 = this.x + this.width;
  } else if (this.x < 0) {
    this.x = 0;
    this.x2 = this.x + this.width;
  } else if (this.x + this.width > this.canvasWidth) {
    this.x = this.canvasWidth - this.width;
    this.x2 = this.x + this.width;
  }
  if (this.leftPressed || this.rightPressed) {
    // console.log(this.x, this.x2);
    // console.log(this.y, this.y2);
  }
};

function Level(canvasWidth) {
  this.canvasWidth = canvasWidth;
  this.blockWidth = this.canvasWidth / 10;
  this.blockHeight = this.canvasWidth / 30;
  this.blocks = [];
  this.buildLevel1();
};

Level.prototype.buildLevel1 = function() {
  for (var i = 2; i < 7; i++) {
    for (var j = 0; j < 10; j++) {
      this.blocks.push(new Block(this.blockWidth * j, this.blockHeight * i, this.blockWidth, this.blockHeight));
    }
  }
};

Level.prototype.removeBlock = function(index) {
  this.blocks.splice(index, 1);
};

function Block(x, y, blockWidth, blockHeight) {
  this.strength = 1;
  this.x = x;
  this.y = y;
  this.blockWidth = blockWidth;
  this.blockHeight = blockHeight;
  this.x2 = this.x + this.blockWidth;
  this.y2 = this.y + this.blockHeight;
  this.type
  this.color = this.getColor();
  this.influence
};

Block.prototype.getColor = function() {
  var rando = Math.ceil(Math.random() * 8);
  switch (rando) {
    case 1:
      return "red";
    case 2:
      return "blue";
    case 3:
      return "yellow";
    case 4:
      return "magenta";
    case 5:
      return "green"
    case 6:
      return "purple";
    case 7:
      return "orange";
    case 8:
      return "lightgreen";
  }
};

// user interface logic
Gameboard.prototype.drawGameCanvas = function(context, canvas) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.fillStyle = this.ball.color;
  context.arc(this.ball.x, this.ball.y, this.ball.radius, 0, 2 * Math.PI);
  context.fillStyle = this.paddle.color;
  context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  context.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  this.currentLevel.blocks.forEach(function(block) {
    context.fillStyle = block.color;
    context.fillRect(block.x, block.y, block.blockWidth, block.blockHeight);
    context.fillstyle = "black";
    context.strokeRect(block.x, block.y, block.blockWidth, block.blockHeight);
  })
  context.fillStyle = this.ball.color;
  context.fill();
  context.stroke();
  context.closePath();
};

var gameboard = new Gameboard();


$(document).ready(function() {
  var gameCanvas = document.getElementById("gameCanvas");
  var gameContext = gameCanvas.getContext("2d");
  var now;
  var then = Date.now();;
  var runGame = setInterval(runGame, 1000/60);
  function runGame() {
    now = Date.now();
    var timePassed = now - then;
    gameboard.repositionElements(timePassed);
    gameboard.drawGameCanvas(gameContext, gameCanvas);
    then = now;
  };
  $(window).keydown(function(event) {
    var key = event.which
    if (key === 37) {
      gameboard.paddle.leftPressed = true;
    } else if (key === 39) {
      gameboard.paddle.rightPressed = true;
    } else if (key === 38) {
      gameboard.ball.stuck = false;
    }
  });
  $(window).keyup(function(event) {
    var key = event.which;
    if (key === 37) {
      gameboard.paddle.leftPressed = false;
    } else if (key === 39) {
      gameboard.paddle.rightPressed = false;
    } else if (key === 40) {
      gameboard.ball.stuck = true;
    }
  });
});
