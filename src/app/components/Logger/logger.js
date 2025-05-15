// logger.js

const { createLogger, format, transports } = require('winston');
const Transport = require('winston-transport');
const { Client } = require('@opensearch-project/opensearch');

/**
 * Custom transport that sends logs to OpenSearch using the official client.
 */
class OpenSearchTransport extends Transport {
  constructor(opts) {
    super(opts);
    // Use the 'node' URL from options or default to localhost on port 9200.
    this.client = new Client({ node: opts.node || 'http://localhost:9200' });
    // Use a static index name, defaulting to 'nodejs-app'.
    this.index = opts.index || 'nodejs-app';
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });
    // Build the document payload
    const document = {
      timestamp: new Date().toISOString(),
      level: info.level,
      message: info.message,
      ...(info.meta && { meta: info.meta })
    };
    
    // Index the document into OpenSearch
    this.client.index({
      index: this.index,
      body: document
    }, (err, resp) => {
      if (err) {
        // Log an error to the console for debugging purposes
        console.error('Error indexing log to OpenSearch:', err);
      }
      // Optionally, you can log the response for further debugging:
      // else { console.log('Index response:', resp.body); }
    });

    // Complete the log operation.
    if (callback) {
      callback();
    }
  }
}

// Create an instance of the custom transport.
const osTransport = new OpenSearchTransport({
  level: 'info',
  // Set the OpenSearch endpoint. Adjust based on your environment.
  node: 'http://localhost:9200',
  index: 'nodejs-app'
});

// Create the Winston logger with our custom transport plus a console transport.
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    osTransport,
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ]
});

module.exports = logger;