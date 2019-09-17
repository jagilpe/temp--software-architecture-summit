'use strict';

const fs = require('fs').promises,
      http = require('http'),
      path = require('path');

const bodyParser = require('body-parser'),
      cors = require('cors'),
      express = require('express'),
      flaschenpost = require('flaschenpost').default;

const EventPublisher = require('./EventPublisher'),
      Eventstore = require('./stores/Eventstore'),
      routes = require('./routes'),
      Viewstore = require('./stores/Viewstore');

const logger = flaschenpost.getLogger();

class Runtime {
  constructor ({ port }) {
    this.port = port;
  }

  async run () {
    const { port } = this;

    const viewsDirectory = path.join(__dirname, '..', 'server', 'views');
    const viewFileNames = await fs.readdir(viewsDirectory);
    const viewNames = viewFileNames.map(viewFileName => path.basename(viewFileName, '.js'));

    const eventPublisher = new EventPublisher(),
          eventstore = new Eventstore(),
          viewstore = new Viewstore({ viewNames });

    eventPublisher.on('event::*', event => {
      viewstore.handleEvent({ event });
    });

    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    app.post('/api/v1/command', routes.postCommand({ eventPublisher, eventstore }));
    app.get('/api/v1/events', routes.getEvents({ eventPublisher }));
    app.get('/api/v1/query/:queryName', routes.getQuery({ viewstore }));

    const server = http.createServer(app);

    server.listen(port, () => {
      logger.info('Server started.', { port });
    });
  }
}

module.exports = Runtime;
