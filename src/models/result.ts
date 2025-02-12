import { Company } from './company.js';
import { Position } from './positions.js';
import { Provider } from './provider.js';

export interface Result {
  company: Company;
  position: Position;
  provider: Provider;
  duration: string;
  departureTime: Date;
  arrivalTime: Date;
  stops: string;
  mode: string;
  price: number;
  originalPrice: number;
  ticketsLeft: number;
  journeyId: string;
  outboundId: string;
  ticketsSellingCompanies: string[];
  segments: number[];
  status: string;
}
