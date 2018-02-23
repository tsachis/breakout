import Phaser from 'phaser';

export default class Ball extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'ball');
    this.scale.setTo(0.05, 0.05);
    this.game.physics.arcade.enableBody(this);
    this.anchor.setTo(0.5, 0.5);
    this.checkWorldBounds = true;
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1);
  }

  update () {
    if (this.onPaddle) {
      return;
    }
    this.angle += 5;
  }
}
