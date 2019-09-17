'use strict';

const getEvents = function ({ eventPublisher }) {
  return function (req, res) {
    res.writeHead(200, {
      'content-type': 'application/ndjson'
    });

    eventPublisher.on('event::*', event => {
      res.write(`${JSON.stringify(event)}\n`);
    });
  };
};

module.exports = getEvents;
