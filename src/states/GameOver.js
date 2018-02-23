import Phaser from 'phaser';
import globals from './globals';
import _ from 'lodash';

const FONT_FAMILY = 'Bungee Shade';

//  The Google WebFont Loader will look for this object, so create it before loading the script.
export default class extends Phaser.State {

  init () {
  }

  create () {
    this.text = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'GAME OVER',
      {
        font: FONT_FAMILY,
        fontSize: 60
      }
    );
    this.game.add.audio('game-over').play();
    const grd = this.text.context.createLinearGradient(0, 0, 0, this.text.canvas.height);
    grd.addColorStop(0, '#b36e7c');
    grd.addColorStop(1, '#b3012a');
    this.text.fill = grd;
    this.text.anchor.setTo(0.5, 0.5);

    this.game.input.onDown.add(() => {
      this.game.state.start('Game');
      this.game.globals = _.clone(globals);
    });
  }

  update () {
    if (this.text.fontSize < 100) {
      this.text.fontSize += 3;
    }
  }
}
