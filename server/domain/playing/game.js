'use strict';

const riddles = require('../../shared/riddles');

const initialState = {
  isOpened: false,
  level: undefined
};

const commands = {
  open: {
    handle (game, command) {
      if (game.state.isOpened) {
        return command.reject('Game is already open.');
      }

      const level = 1;
      const { riddle } = riddles[level - 1];

      game.publishEvent('opened', { level, riddle });
    }
  }
};

const events = {
  opened: {
    handle (game, event) {
      game.setState({
        isOpened: true,
        level: event.payload.level
      });
    }
  }
};

module.exports = { initialState, commands, events };
