'use strict';

class Command {
  constructor (data) {
    this.context = {
      name: data.context.name
    };
    this.aggregate = {
      name: data.aggregate.name,
      id: data.aggregate.id
    };
    this.name = data.name;
    this.id = data.id;
    this.payload = data.payload || {};
  }

  /* eslint-disable class-methods-use-this */
  reject (reason) {
    throw new Error(reason);
  }
  /* eslint-enable class-methods-use-this */
}

module.exports = Command;
