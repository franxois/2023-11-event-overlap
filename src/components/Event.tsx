import { FC } from "react";

export const Event: FC<{
  id: number;
  top: number;
  left: number;
  height: number;
  width: number | undefined;
}> = ({ id, top, left, height, width }) => (
  <div
    key={id}
    className="event text-centered"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      height: `${height}%`,
      width: `${width}%`,
    }}
  >
    {id}
  </div>
);
