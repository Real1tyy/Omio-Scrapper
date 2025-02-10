import { createPlaywrightRouter } from 'crawlee';
import { BASE_LABEL } from '../constants/labels.js';
import baseHandleStart from '../handlers/start.js';
import { Input } from '../models/model.js';

export const createPlaywrightRouterWithInput = async (input: Input) => {
  const playwrightRouter = createPlaywrightRouter();
  playwrightRouter.addHandler(BASE_LABEL, baseHandleStart(input));

  return playwrightRouter;
};

export default createPlaywrightRouterWithInput;
