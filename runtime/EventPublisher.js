'use strict';

const EventEmitter = require('eventemitter2');

class EventPublisher extends EventEmitter {
  constructor () {
    super({
      wildcard: true,
      delimiter: '::'
    });
  }

  publish ({ event }) {
    const fullyQualifiedEventName = `${event.context.name}.${event.aggregate.name}.${event.name}`;

    this.emit(`event::${fullyQualifiedEventName}`, event);
  }
}

module.exports = EventPublisher;
