'use strict';

const flaschenpost = require('flaschenpost').default;

const Aggregate = require('./elements/Aggregate'),
      Event = require('./elements/Event');

const logger = flaschenpost.getLogger();

const handleCommand = function ({ command, eventPublisher, eventstore }) {
  const {
    context: { name: contextName },
    aggregate: { name: aggregateName, id: aggregateId },
    name: commandName,
    id: commandId
  } = command;

  /* eslint-disable global-require */
  const aggregateDefinition =
    require(`../server/domain/${contextName}/${aggregateName}`);
  /* eslint-enable global-require */

  const events = eventstore.getEventsByAggregateId({ aggregateId });

  const aggregate = new Aggregate({
    aggregateDefinition,
    contextName,
    aggregateName,
    aggregateId,
    commandId
  });

  aggregate.replay({ events });

  try {
    aggregateDefinition.commands[commandName].handle(aggregate, command);
  } catch (ex) {
    const reason = ex.message;

    logger.error('Command rejected.', { command, reason });

    const event = new Event({
      context: { name: contextName },
      aggregate: { name: aggregateName, id: aggregateId },
      name: `${commandName}Rejected`,
      causationId: command.id,
      payload: { reason }
    });

    return eventPublisher.publish({ event });
  }

  logger.info('Command handled.', { command });

  for (const event of aggregate.uncommittedEvents) {
    eventstore.saveEvent({ event });
    eventPublisher.publish({ event });
  }
};

module.exports = handleCommand;
