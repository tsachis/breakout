import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config';
import _ from 'lodash'
import globals from './globals/index';

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#fff';
    this.fontsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);
  }

  create () {
    this.game.globals = _.clone(globals);
    this.stage.setBackgroundColor('#eee');
  }

  preload () {
    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      });
    }

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' });
    text.anchor.setTo(0.5, 0.5);

    this.load.image('loaderBg', './assets/images/loader-bg.png');
    this.load.image('loaderBar', './assets/images/loader-bar.png');
    this.load.image('brick', './assets/images/brick.png');
    this.load.image('paddle', './assets/images/paddle.png');
    this.load.image('ball', './assets/images/ball.png');
    this.load.audio('ping', 'assets/audio/ping.ogg');
    this.load.audio('lost-ball', 'assets/audio/lost-ball.ogg');
    this.load.audio('game-over', 'assets/audio/game-over.ogg');
  }

  render () {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash');
    }
    if (!config.webfonts.length) {
      this.state.start('Splash');
    }
  }

  fontsLoaded () {
    this.fontsReady = true;
  }
}
