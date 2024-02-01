/* eslint-disable import/no-named-as-default-member -- ok for this file */
import winston from 'winston';
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston';
// import { isProduction } from "@billing/base";
import { env } from './env';

const _logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.splat(),
        winston.format.printf((info) => {
          if (typeof info.message === 'object') {
            info.message = JSON.stringify(info.message, null, 3);
          }

          return `${info.level}: ${info.message}`;
        })
      ),
    }),
    // ...(isProduction()
    //   ? [
    //       new AxiomTransport({
    //         dataset: env.AXIOM_DATASET,
    //         token: env.AXIOM_TOKEN,
    //         orgId: env.AXIOM_ORG_ID,
    //       }),
    //     ]
    //   : []),
  ],
});

export const logger = {
  log: _logger.info.bind(_logger),
  info: _logger.info.bind(_logger),
  warn: _logger.warn.bind(_logger),
  error: _logger.error.bind(_logger),
};
