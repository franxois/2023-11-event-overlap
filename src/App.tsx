import { FC } from "react";

import "./App.css";
import input from "./input";
import type { Event, StartTime } from "./types";

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
  const events = Object.fromEntries(
    input
      .map(({ id, start, duration }): Event => {
        const overlap = input
          .filter(({ id: oId, start: oStart, duration: oDuration }) => {
            if (id === oId) return false;

            const timeStart = timeToMinutes(start);
            const oTimeStart = timeToMinutes(oStart);
            const oEndTime = oTimeStart + oDuration;

            if (oEndTime <= timeStart) {
              // Other event finish before
              return false;
            }

            if (oTimeStart >= timeStart + duration) {
              // Other event start after
              return false;
            }

            return true;
          })
          .map((event) => event.id);

        return {
          id,
          start,
          duration,
          overlap,
        };
      })
      .map((event) => [event.id, event])
  );

  const idsSortedByOverlap = Object.keys(events).sort((a, b) =>
    events[a].overlap.length < events[b].overlap.length ? 1 : -1
  );
  for (const id of idsSortedByOverlap) {
    const event = events[id];

    if (event.overlap.length === 0) continue;

    const myOverlapLen = event.overlap.length;

    if (
      myOverlapLen >
      Math.max(...event.overlap.map((id) => events[id].overlap.length))
    ) {
      // This event overlap many event, but not all at the same time
      continue;
    }

    // TODO : if there is already a width set, use it instead of 100%/count

    let widthPercent = 100 / (myOverlapLen + 1);

    const ids = [id, ...event.overlap].sort((a, b) =>
      // Sort by event duration descending
      events[a].duration > events[b].duration ? -1 : 1
    );

    const minOfCurrentWidths = Math.min(
      ...ids.map((i) => events[i].width || 100)
    );

    if (widthPercent > minOfCurrentWidths) widthPercent = minOfCurrentWidths;

    for (let offset = 0; offset < ids.length; offset++) {
      const existingEventWithThisOffset = ids
        .map((i) => events[i])
        .find((e) => e.hOffset === offset);

      if (existingEventWithThisOffset === undefined) {
        const firstSiblingWithoutOffset = ids
          .map((i) => events[i])
          .find((e) => e.hOffset === undefined);

        if (firstSiblingWithoutOffset) {
          events[firstSiblingWithoutOffset.id].hOffset = offset;
          events[firstSiblingWithoutOffset.id].width = widthPercent;
        }
      }
    }
  }

  return (
    <main>
      {Object.values(events).map(({ id, start, duration, hOffset, width }) => {
        const verticalOffset = getPercentOffset(start);
        const heightPercent = getPercentFullHeight(duration);

        return (
          <div
            key={id}
            className="event text-centered"
            style={{
              top: `${verticalOffset}%`,
              left: `${(width || 0) * (hOffset || 0)}%`,
              height: `${heightPercent}%`,
              width: `${width}%`,
            }}
          >
            {id}
          </div>
        );
      })}
    </main>
  );
};
