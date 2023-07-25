import pinohttp from 'pino-http';
import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${process.cwd()}/server.log` },
      level: process.env.LOG_LEVEL || 'info' // does nothing?
    },
    {
      target: 'pino-pretty',
      options: {
        ignore: 'req.headers,req.method,req.query,req.params,req.remoteAddress,req.remotePort,res.headers'
      },
      level: process.env.LOG_LEVEL || 'info' // does nothing?
    },
  ],
});

const logger = pinohttp(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  transport
);

export default logger;