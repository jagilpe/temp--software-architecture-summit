'use strict';

const flaschenpost = require('flaschenpost').default;

const Command = require('../elements/Command'),
      handleCommand = require('../handleCommand');

const logger = flaschenpost.getLogger();

const postCommand = function ({ eventPublisher, eventstore }) {
  return function (req, res) {
    res.status(200).end();

    const command = new Command(req.body);

    logger.info('Command received.', { command });

    handleCommand({ command, eventPublisher, eventstore });
  };
};

module.exports = postCommand;
