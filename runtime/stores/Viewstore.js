'use strict';

class Viewstore {
  constructor ({ viewNames }) {
    this.views = {};

    for (const viewName of viewNames) {
      this.views[viewName] = [];
    }
  }

  getView ({ viewName }) {
    return this.views[viewName];
  }

  handleEvent ({ event }) {
    const fullyQualifiedEventName = `${event.context.name}.${event.aggregate.name}.${event.name}`;

    for (const [ viewName, view ] of Object.entries(this.views)) {
      /* eslint-disable global-require */
      const viewDefinition = require(`../../server/views/${viewName}`);
      /* eslint-enable global-require */

      if (!viewDefinition.projections[fullyQualifiedEventName]) {
        continue;
      }

      viewDefinition.projections[fullyQualifiedEventName].handle(view, event);
    }
  }
}

module.exports = Viewstore;
