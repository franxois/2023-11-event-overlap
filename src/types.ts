export type TimeString = `${number}:${number}`;

export type BaseEvent = { id: number; start: TimeString; duration: number };

export type Event = BaseEvent & {
  // Other event ids that overlap
  overlap: number[];
  // Horizontal position
  offset?: number;
  // Event width, in percent
  width?: number;
};
