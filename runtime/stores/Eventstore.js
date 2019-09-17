'use strict';

class Eventstore {
  constructor () {
    this.events = [];
  }

  saveEvent ({ event }) {
    this.events.push(event);
  }

  getEventsByAggregateId ({ aggregateId }) {
    return this.events.
      filter(event => event.aggregate.id === aggregateId);
  }
}

module.exports = Eventstore;
