import { TimeString } from "../types";

const timeToMinutes = (time: TimeString) => {
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
};

export class PlaceInDay {
  dateStartMinutes: number;
  lengthOfTheDayInMinutes: number;

  constructor(dayStartTime: TimeString, dayEndTime: TimeString) {
    this.dateStartMinutes = timeToMinutes(dayStartTime);
    const dateEndMinutes = timeToMinutes(dayEndTime);

    this.lengthOfTheDayInMinutes = dateEndMinutes - this.dateStartMinutes;
  }

  getPercentOffset = (time: TimeString) => {
    return this.getPercentFullHeight(
      timeToMinutes(time) - this.dateStartMinutes
    );
  };

  getPercentFullHeight = (minutes: number) => {
    return (minutes * 100) / this.lengthOfTheDayInMinutes;
  };
}
