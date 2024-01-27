import { logger } from '@billing/logger';
import { createServer } from '@server/server';

const port = process.env.PORT || 5001;
const server = createServer();

server.listen(port, () => {
  logger.info(`API server running on ${port}.`);
});
