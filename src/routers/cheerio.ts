import { createCheerioRouter } from 'crawlee';
import { Input } from '../models/model.js';
import logger from '../utils/logger.js';
const createCheerioRouterwithInput = async (input: Input) => {
  const cheerioRouter = createCheerioRouter();
  logger.info(`from cheerio router: ${input}`);

  return cheerioRouter;
};

export default createCheerioRouterwithInput;
