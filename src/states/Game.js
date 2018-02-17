import Phaser from 'phaser'
import Brick from '../prefabs/Brick'

export default class extends Phaser.State {
  init () { }
  preload () { }

  create () {
    this.setupText();
    this.setupBricks();
  }

  setupBricks () {
    this.bricksGroup = this.game.add.group();
    this.generateBricks(this.bricksGroup);
  }

  generateBricks (bricksGroup) {
    const rows = 5;
    const columns = 15;
    const xOffset = 50;
    const yOffset = 45;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        bricksGroup.add(new Brick(this.game, x * xOffset, y * yOffset));
      }
    }

    const brickGroupWidth = (columns * xOffset);

    bricksGroup.position.setTo(
      this.game.world.centerX - (brickGroupWidth / 2),
      this.game.world.centerY - 250
    );
  }

  setupText () {
    this.createText(20, 20, 'left', `score: ${this.game.globals.score}`);
    this.createText(0, 20, 'center', `lives: ${this.game.globals.lives}`);
    this.createText(-20, 20, 'right', `level: ${this.game.globals.level}`);
  }

  createText (xOffset, yOffset, align, text) {
    return this.add.text(
      xOffset,
      yOffset,
      text,
      {
        font: 'Ariel 18px',
        fill: '#333',
        boundsAlignH: align
      }
    ).setTextBounds(0, 0, this.game.world.width, 0);
  }

  render () {
  }
}
