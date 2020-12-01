export const NO_OF_ACTIVITIES = 'No. of activities';
export const HOURS = 'Hours';
export const DAYS = 'Days';
export const MONTHS = 'Months';
export const AXIO_CANCELLED = 'Axios request has been cancelled!';

export interface DataType {
  x: string,
  y: number,
}

export interface RadialBarDataType {
  name: string,
  value: number,
  fill: string,
}

export enum TabTypes{
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export interface StatisticsTabInput {
  date?: Date,
  chartOnClick?: (date: Date, fromTab: TabTypes) => void,
}
