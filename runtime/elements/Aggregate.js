'use strict';

const { cloneDeep, merge } = require('lodash');

const Event = require('./Event');

class Aggregate {
  constructor ({
    aggregateDefinition,
    contextName,
    aggregateName,
    aggregateId,
    commandId
  }) {
    this.aggregateDefinition = aggregateDefinition;
    this.contextName = contextName;
    this.aggregateName = aggregateName;
    this.aggregateId = aggregateId;
    this.commandId = commandId;

    this.state = cloneDeep(aggregateDefinition.initialState);

    this.uncommittedEvents = [];
  }

  publishEvent (eventName, eventPayload = {}) {
    const { contextName, aggregateName, aggregateId, commandId } = this;

    const event = new Event({
      context: { name: contextName },
      aggregate: { name: aggregateName, id: aggregateId },
      name: eventName,
      causationId: commandId,
      payload: eventPayload
    });

    this.uncommittedEvents.push(event);
  }

  replay ({ events }) {
    const { aggregateDefinition } = this;

    for (const event of events) {
      aggregateDefinition.events[event.name].handle(this, event);
    }
  }

  setState (newState) {
    this.state = merge({}, this.state, newState);
  }
}

module.exports = Aggregate;
