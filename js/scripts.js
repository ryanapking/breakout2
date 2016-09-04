function Gameboard() {
  this.width = 400;
  this.paddle = new Paddle(this.width);
  this.ball = new Ball(this.width);
  this.currentLevel = new Level(this.width);
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
  this.ball.x += this.ball.speed * this.ball.direction * timePassed / 1000;
  this.ball.y += this.ball.speed * this.ball.slope * timePassed / 1000;
  this.ball.x2 = this.ball.x + this.ball.width;
  this.ball.y2 = this.ball.y + this.ball.height;
  this.checkCollision();
};

Gameboard.prototype.checkCollision = function() {
  if (this.checkWalls()) {
    return;
  }
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

Gameboard.prototype.withinX = function(x, x2) {
  if (this.ball.x >= x && this.ball.x <= x2 || this.ball.x2 >= x && this.ball.x2 <= x2) {
    return true;
  } else {
    return false;
  }
};

Gameboard.prototype.withinY = function(y, y2) {
  if (this.ball.y >= y && this.ball.y <= y2 || this.ball.y2 >= y && this.ball.y2 <= y2) {
    return true;
  } else {
    return false;
  }
};

Gameboard.prototype.withinXY = function(x, y) {
  
};

Gameboard.prototype.checkBottom = function() {
  if (this.withinX(this.paddle.x, this.paddle.x2) && this.withinY(this.paddle.y, this.paddle.y2)) {
    this.ball.slope = -this.ball.slope;
  }
};

Gameboard.prototype.checkTop = function() {
  for (var i = 0; i < this.currentLevel.blocks.length; i++) {
    if (this.withinX(this.currentLevel.blocks[i].x, this.currentLevel.blocks[i].x2) && this.withinY(this.currentLevel.blocks[i].y, this.currentLevel.blocks[i].y2)) {
      this.ball.slope = -this.ball.slope;
      this.currentLevel.removeBlock(i);
    } else {
    }
  }
};

Gameboard.prototype.checkLeft = function() {
  for (var i = 0; i < this.currentLevel.blocks.length; i++) {
    if (this.withinX(this.currentLevel.blocks[i].x, this.currentLevel.blocks[i].y) && this.withinY(this.currentLevel.blocks[i].x2, this.currentLevel.blocks[i].y2)) {
      this.ball.direction = -this.ball.direction;
      this.currentLevel.removeBlock(i);
    } else {
    }
  }
};

Gameboard.prototype.checkRight = function() {

};

Gameboard.prototype.checkWalls = function() {
  if (this.ball.x < 0) {
    this.ball.direction = -this.ball.direction;
    return true;
  } else if (this.ball.x2 > this.width) {
    this.ball.direction = -this.ball.direction;
    return true;
  }
  if (this.ball.y < 0) {
    this.ball.slope = -this.ball.slope;
    return true;
  } else if (this.ball.y > this.width) {
    alert("ball lost!");
  }
  return false;
};

Gameboard.prototype.ballStuck = function() {
  if (this.ball.stuck) {
    this.ball.x = this.paddle.x + (.5 * this.paddle.width) - (.5 * this.ball.width);
    this.ball.y = this.paddle.y - this.ball.height;
  }
}

function Ball(canvasWidth) {
  this.canvasWidth = canvasWidth;
  this.x = 200;
  this.y = 200;
  this.width = this.canvasWidth / 60;
  this.height = this.width;
  this.x2 = this.x + this.width;
  this.y2 = this.y + this.height;
  this.speed = this.canvasWidth / 1.5;
  this.slope = -1;
  this.direction = .5;
  this.color = "lightgray";
  this.stuck = true;
};

Ball.prototype.changeDirection = function() {

};

function Paddle(canvasWidth) {
  this.canvasWidth = canvasWidth;
  this.x = 0;
  this.y = (this.canvasWidth / 20) * 17;
  this.width = (this.canvasWidth / 20) * 3;
  this.height = this.canvasWidth / 40;
  this.x2 = this.x + this.width;
  this.y2 = this.y + this.height;
  this.speed = this.canvasWidth / 2;
  this.influence
  this.color = "gray";
  this.leftPressed = false;
  this.rightPressed = false;
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
  context.fillRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
  context.strokeRect(this.ball.x, this.ball.y, this.ball.width, this.ball.height);
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
