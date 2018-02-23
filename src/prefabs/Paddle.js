import Phaser from 'phaser';

export default class Paddle extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'paddle');
    this.game.physics.arcade.enableBody(this);
    this.anchor.setTo(0.5, 0.5);
    this.body.immovable = true;
  }

  update () {
    if (this.game.input.x === 0) {
      return;
    }
    this.x = this.game.input.x;
    const half = this.width / 2;
    if (this.x < half) {
      this.x = half;
    } else if (this.x > this.game.width - half) {
      this.x = this.game.input.x - half;
    }
  }
}
