const { createLogger, transports } = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');

const {
  NODE_ENV,
  CLOUDWATCH_ACCESS_KEY_ID,
  CLOUDWATCH_SECRET_ACCESS_KEY,
  CLOUDWATCH_REGION
} = process.env;

const config = {
  logGroupName: 'task-manager-logs-group',
  logStreamName: NODE_ENV,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: {
    accessKeyId: CLOUDWATCH_ACCESS_KEY_ID,
    secretAccessKey: CLOUDWATCH_SECRET_ACCESS_KEY,
    region: CLOUDWATCH_REGION
  },
  formatLog: function (item) {
    return item.level + ': ' + item.message + ' ' + JSON.stringify(item.meta)
  }
};

const transportsConfig = (NODE_ENV === 'production')
  ? [new CloudWatchTransport(config)]
  : [new transports.Console()];

const logger = createLogger({
  level: 'info',
  transports: transportsConfig
});

// logger.level = process.env.LOG_LEVEL || "silly";

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
