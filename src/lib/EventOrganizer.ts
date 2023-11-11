import { BaseEvent, Event, TimeString } from "../types";
import { PlaceInDay } from "./PlaceInDay";

const timeToMinutes = (time: TimeString) => {
  const [h, m] = time.split(":");
  return parseInt(h) * 60 + parseInt(m);
};

export class EventOrganizer {
  dayPlacer: PlaceInDay;

  constructor(dayPlacer: PlaceInDay) {
    this.dayPlacer = dayPlacer;
  }

  /**
   * Process input and return list of events with css properties ready to display
   */
  process = (input: BaseEvent[]) => {
    let events = this.getEventWithOverlapsMap(input);

    events = this.computeEventPositionAndWidth(events);

    return Object.values(events).map(this.eventToCssProperties);
  };

  /**
   * For each events in input, list other events that overlap
   */

  private getEventWithOverlapsMap = (input: BaseEvent[]) => {
    return Object.fromEntries(
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
  };

  /**
   * Compute width and horizontal offset for each event
   */

  private computeEventPositionAndWidth = (events: { [k: string]: Event }) => {
    const idsSortedByOverlapCount = Object.keys(events).sort((a, b) =>
      events[a].overlap.length < events[b].overlap.length ? 1 : -1
    );

    for (const id of idsSortedByOverlapCount) {
      const event = events[id];

      // Event with no overlap will use full width, ignore here
      if (event.overlap.length === 0) continue;

      const myOverlapLen = event.overlap.length;

      if (
        myOverlapLen >
        Math.max(...event.overlap.map((id) => events[id].overlap.length))
      ) {
        // This event overlap many event, but not all at the same time, ignore for the moment
        continue;
      }

      let widthPercent = 100 / (myOverlapLen + 1);

      const ids = [id, ...event.overlap].sort((a, b) =>
        // Sort by event duration descending
        events[a].duration > events[b].duration ? -1 : 1
      );

      const minOfCurrentWidths = Math.min(
        ...ids.map((i) => events[i].width || 100)
      );

      // Every event should use the maximum width available while having same width as every event it overlaps
      if (widthPercent > minOfCurrentWidths) widthPercent = minOfCurrentWidths;

      // We try to attribute position 0..n to each event, checking if siblings have already a position
      for (let offset = 0; offset < ids.length; offset++) {
        const existingEventWithThisOffset = ids
          .map((i) => events[i])
          .find((e) => e.offset === offset);

        if (existingEventWithThisOffset === undefined) {
          const firstSiblingWithoutOffset = ids
            .map((i) => events[i])
            .find((e) => e.offset === undefined);

          if (firstSiblingWithoutOffset) {
            events[firstSiblingWithoutOffset.id].offset = offset;
            events[firstSiblingWithoutOffset.id].width = widthPercent;
          }
        }
      }
    }

    return events;
  };

  /**
   * Translate Event to css styles properties used in component
   */

  private eventToCssProperties = (event: Event) => ({
    id: event.id,
    top: this.dayPlacer.getPercentOffset(event.start),
    height: this.dayPlacer.getPercentFullHeight(event.duration),
    width: event.width,
    left: (event.width || 0) * (event.offset || 0),
  });
}
