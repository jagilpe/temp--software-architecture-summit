'use strict';

const uuid = require('uuidv4').default;

class Event {
  constructor (data) {
    this.context = {
      name: data.context.name
    };
    this.aggregate = {
      name: data.aggregate.name,
      id: data.aggregate.id
    };
    this.name = data.name;
    this.id = uuid();
    this.causationId = data.causationId;
    this.payload = data.payload || {};
  }
}

module.exports = Event;
