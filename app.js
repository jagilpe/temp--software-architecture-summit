'use strict';

const processenv = require('processenv').default;

const Runtime = require('./runtime/Runtime');

const port = processenv('PORT', 3000);

const runtime = new Runtime({ port });

(async () => {
  await runtime.run();
})();
