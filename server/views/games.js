'use strict';

const projections = {
  'playing.game.opened': {
    handle (games, event) {
      games.push({
        gameId: event.aggregate.id,
        currentLevel: event.payload.level,
        currentRiddle: event.payload.riddle
      });
    }
  }
};

module.exports = { projections };
