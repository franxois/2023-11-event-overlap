export type StartTime = `${number}:${number}`;

export type BaseEvent = { id: number; start: StartTime; duration: number };

export type Event = BaseEvent & {
  overlap: number[];
  hOffset?: number;
  width?: number;
};
