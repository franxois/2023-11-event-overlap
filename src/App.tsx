import { FC } from "react";

import "./App.css";
import input, { StartTime } from "./input";

const timeToMinutes = (time: StartTime) => {
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
};

const dayStartTime: StartTime = "09:00";
const dayEndTime: StartTime = "21:00";

const dateStartMinutes = timeToMinutes(dayStartTime);
const dateEndMinutes = timeToMinutes(dayEndTime);

const lengthOfTheDayInMinutes = dateEndMinutes - dateStartMinutes;

const getPercentOffset = (time: StartTime) => {
  return getPercentFullHeight(timeToMinutes(time) - dateStartMinutes);
};

const getPercentFullHeight = (minutes: number) => {
  return (minutes * 100) / lengthOfTheDayInMinutes;
};

export const App: FC = () => {
  return (
    <main>
      {input

        .map(({ id, start, duration }) => {
          const overlap = input.filter(
            ({ id: oId, start: oStart, duration: oDuration }) => {
              if (id === oId) return false;

              const timeStart = timeToMinutes(start);
              const oTimeStart = timeToMinutes(oStart);
              const oEndTime = oTimeStart + oDuration;

              if (oEndTime < timeStart) {
                // Other event finish before
                return false;
              }

              if (oTimeStart > timeStart + duration) {
                // Other event start after
                return false;
              }

              return true;
            }
          );

          return { id, start, duration, overlap };
        })

        .map(({ id, start, duration, overlap }) => {
          const verticalOffset = getPercentOffset(start);
          const heightPercent = getPercentFullHeight(duration);

          console.log(id, overlap);

          return (
            <div
              className="event text-centered"
              style={{
                top: `${verticalOffset}%`,
                height: `${heightPercent}%`,
                width: `${100 / (overlap.length + 1)}%`,
              }}
            >
              {id} - {start} ({duration}min)
            </div>
          );
        })}
    </main>
  );
};
