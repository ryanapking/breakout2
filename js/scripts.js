function Gameboard() {
  this.width = 400;
  this.paddle = new Paddle(this.width);
  this.ball = new Ball();
  this.currentLevel = new Level(this.width);
};

Gameboard.prototype.repositionElements = function(timePassed) {
  this.paddle.repositionPaddle(timePassed);
}

Gameboard.prototype.repositionBall = function() {

};

Gameboard.prototype.checkCollision = function() {
  if (this.ball.slope > 0) {
    this.checkBottom();
  } else {
    this.checkTop();
  }
  if (this.ball.direction > 0) {
    this.checkRight();
  } else {
    this.checkLeft();
  }
};

Gameboard.prototype.checkBottom = function() {

};

Gameboard.prototype.checkTop = function() {

};

Gameboard.prototype.checkLeft = function() {

};

Gameboard.prototype.checkRight = function() {

};

function Ball() {
  this.location
  this.size
  this.speed
  this.slope
  this.direction
};

Ball.prototype.changeDirection = function() {

};

function Paddle(canvasWidth) {
  this.canvasWidth = canvasWidth;
  this.x = 0;
  this.y = (this.canvasWidth / 20) * 17;
  this.width = (this.canvasWidth / 20) * 3;
  this.height = this.canvasWidth / 40;
  this.speed = this.canvasWidth / 2;
  this.influence
  this.color = "gray";
  this.leftPressed = false;
  this.rightPressed = false;
};

Paddle.prototype.repositionPaddle = function(timePassed) {
  if (this.leftPressed && this.x > 0) {
    this.x -= (this.speed * (timePassed / 1000));
  } else if (this.rightPressed && this.x + this.width < this.canvasWidth) {
    this.x += (this.speed * (timePassed / 1000));
  } else if (this.x < 0) {
    this.x = 0;
  } else if (this.x + this.width > this.canvasWidth) {
    this.x = this.canvasWidth - this.width;
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
  for (var i = 1; i < 6; i++) {
    for (var j = 0; j < 10; j++) {
      this.blocks.push(new Block(this.blockWidth * j, this.blockHeight * i, this.blockWidth, this.blockHeight));
    }
  }
};

function Block(x, y, blockWidth, blockHeight) {
  this.strength = 1;
  this.x = x;
  this.y = y;
  this.blockWidth = blockWidth;
  this.blockHeight = blockHeight;
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
  context.fillStyle = this.paddle.color;
  context.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  context.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  this.currentLevel.blocks.forEach(function(block) {
    context.fillStyle = block.color;
    context.fillRect(block.x, block.y, block.blockWidth, block.blockHeight);
    context.fillstyle = "black";
    context.strokeRect(block.x, block.y, block.blockWidth, block.blockHeight);
  })
  context.stroke();
  context.closePath();
};

var gameboard = new Gameboard();


$(document).ready(function() {
  var gameCanvas = document.getElementById("gameCanvas");
  var gameContext = gameCanvas.getContext("2d");
  var now;
  var then = Date.now();;
  setInterval(runGame, 1000/60);
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
    }
  });
  $(window).keyup(function(event) {
    var key = event.which;
    if (key === 37) {
      gameboard.paddle.leftPressed = false;
    } else if (key === 39) {
      gameboard.paddle.rightPressed = false;
    }
  });
});
