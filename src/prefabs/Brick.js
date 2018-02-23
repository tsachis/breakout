import Phaser from 'phaser';

export default class Brick extends Phaser.Sprite {
  constructor (game, x, y) {
    super(game, x, y, 'brick');
    this.scale.setTo(0.2, 0.2);
    this.game.physics.arcade.enableBody(this);
    this.body.immovable = true;
  }
}
