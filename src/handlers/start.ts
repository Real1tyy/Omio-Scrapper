import { CheerioCrawlingContext } from 'crawlee';
import { BASE_LABEL } from '../constants/labels.js';
import { BASE_URL } from '../constants/links.js';
import logger from '../utils/logger.js';

const baseHandleStart = async (context: CheerioCrawlingContext) => {
  const { $, request, log, enqueueLinks } = context;
  logger.info(`Processing Start URL: ${request.url}`);

  const paginatorElement = $('li.pagination a:nth-last-child(2)').text().trim();
  const lastPageNumber = parseInt(paginatorElement, 10);

  for (let page = 2; page <= lastPageNumber; page++) {
    const pageUrl = `${BASE_URL}/pronajem-bytu?mesto=Brno&action=search&mapa=&s=${page}-order-0`;
    await enqueueLinks({
      urls: [pageUrl],
      label: BASE_LABEL,
    });
    log.debug(`Enqueued pagination URL: ${pageUrl}`);
  }
};

export default baseHandleStart;
