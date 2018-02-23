import Phaser from 'phaser';
import Brick from '../prefabs/Brick';
import Paddle from '../prefabs/Paddle';
import Ball from '../prefabs/Ball';
import levels from './globals/levels';

export default class extends Phaser.State {
  constructor () {
    super();

    this.ballOnPaddle = true;
  }

  init () { }
  preload () { }

  create () {
    this.game.physics.arcade.checkCollision.down = false;
    this.setupText();
    this.setupBricks();
    this.setupPaddle();
    this.setupBall();

    this.game.input.onDown.add(this.releaseBall, this);
    this.pingSound = this.game.add.audio('ping');
    this.lostBallSound = this.game.add.audio('lost-ball');
  }

  setupBall () {
    this.ball = new Ball(this.game);
    this.game.add.existing(this.ball);

    this.putBallOnPaddle();
    this.ball.events.onOutOfBounds.add(this.ballLost, this);
    this.ball.body.onWorldBounds = new Phaser.Signal();
    this.ball.body.onWorldBounds.add(this.ballHitWall, this);
  }

  ballLost () {
    this.game.globals.lives--;
    this.lostBallSound.play();
    if (this.game.globals.lives === 0) {
      this.endGame();
    } else {
      this.livesText.text = `Lives: ${this.game.globals.lives}  `;
      this.putBallOnPaddle();
    }
  }

  endGame () {
    console.log('game over');
    this.game.state.start('GameOver');
  }

  putBallOnPaddle () {
    this.ballOnPaddle = true;
    this.ball.onPaddle = true;
    this.ball.reset(this.paddle.body.x, this.paddle.y - 20);
  }

  setupPaddle () {
    this.paddle = new Paddle(this.game, this.game.world.centerX, this.game.world.height - 100);
    this.game.add.existing(this.paddle);
  }

  setupBricks () {
    this.bricksGroup = this.game.add.group();
    this.generateBricks(this.bricksGroup);
  }

  generateBricks (bricksGroup) {
    const {matrix} = levels[this.game.globals.level.toString()];
    const xOffset = 50;
    const yOffset = 45;
    let maxWidth = 0;

    for (let y = 0; y < matrix.length; y++) {
      maxWidth = Math.max(maxWidth, matrix[y].length);
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          bricksGroup.add(new Brick(this.game, x * xOffset, y * yOffset));
        }
      }
    }

    const brickGroupWidth = (maxWidth * xOffset);

    bricksGroup.position.setTo(
      this.game.world.centerX - (brickGroupWidth / 2),
      this.game.world.centerY - 250
    );
  }

  releaseBall () {
    if (!this.ballOnPaddle) {
      return;
    }

    this.ballOnPaddle = false;
    this.ball.onPaddle = false;
    this.ball.body.velocity.x = Math.random() * 50 - 50;
    this.ball.body.velocity.y = -300;
  }

  setupText () {
    this.scoreText = this.createText(20, 20, 'left', `SCORE: ${this.game.globals.score}  `);
    this.livesText = this.createText(0, 20, 'center', `LIVES: ${this.game.globals.lives}  `);
    this.levelText = this.createText(-20, 20, 'right', `LEVEL: ${this.game.globals.level}  `);
  }

  createText (xOffset, yOffset, align, text) {
    const textEl = this.add.text(
      xOffset,
      yOffset,
      text,
      {
        font: 'Bangers',
        fontSize: 22,
        fill: '#333',
        boundsAlignH: align
      }
    );
    textEl.setTextBounds(0, 0, this.game.world.width, 0);
    return textEl;
  }

  update () {
    if (this.ballOnPaddle) {
      this.ball.centerX = this.paddle.centerX;
    }

    this.game.physics.arcade.collide(
      this.ball,
      this.paddle,
      this.ballHitPaddle,
      null,
      this
    );

    this.game.physics.arcade.collide(
      this.ball,
      this.bricksGroup,
      this.ballHitBrick,
      null,
      this
    );
  }

  ballHitWall () {
    this.pingSound.play();
  }

  ballHitPaddle (ball, paddle) {
    this.pingSound.play();
    ball.body.velocity.x = 10 * (ball.x - paddle.x);
  }

  ballHitBrick (ball, brick) {
    brick.kill();
    this.pingSound.play();
    this.game.globals.score += 10;
    this.scoreText.text = `Score: ${this.game.globals.score}  `;

    if (!this.bricksGroup.countLiving()) {
      this.game.globals.level++;
      this.levelText.text = `Level: ${this.game.globals.level}  `;
      this.putBallOnPaddle();
      this.generateBricks(this.bricksGroup);
    }
  }

  render () {
  }
}
