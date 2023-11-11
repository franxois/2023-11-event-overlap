import { FC } from "react";

import "./App.css";
import input from "./input";
import type { TimeString } from "./types";
import { EventOrganizer } from "./lib/EventOrganizer";
import { PlaceInDay } from "./lib/PlaceInDay";
import { Event as EventComponent } from "./components/Event";

const dayStartTime: TimeString = "09:00";
const dayEndTime: TimeString = "21:00";

export const App: FC = () => {
  const organizer = new EventOrganizer(
    new PlaceInDay(dayStartTime, dayEndTime)
  );

  return <main>{organizer.process(input).map(EventComponent)}</main>;
};
