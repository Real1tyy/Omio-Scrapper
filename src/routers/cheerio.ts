import { createCheerioRouter } from 'crawlee';
import { BASE_LABEL } from '../constants/labels.js';
import baseHandleStart from '../handlers/start.js';

const cheerioRouter = createCheerioRouter();

cheerioRouter.addHandler(BASE_LABEL, baseHandleStart);

export default cheerioRouter;
