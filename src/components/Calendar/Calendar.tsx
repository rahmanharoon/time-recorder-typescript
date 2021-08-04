import "./Calendar.css";
import React, { useEffect } from "react";
import { addZero } from "../../lib/utils";
import { RootState } from "../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import {
  selectUserEventsArray,
  loadUserEvents,
  UserEvent,
} from "../../redux/user-events";
import EventItem from "./EventItem";

const mapState = (state: RootState) => ({
  events: selectUserEventsArray(state),
});

const mapDispatch = {
  loadUserEvents,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux {}

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDay();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

const groupEventsByDay = (events: UserEvent[]) => {
  const groups: Record<string, UserEvent[]> = {};

  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
  };

  events.forEach((event) => {
    const startDateKey = createDateKey(new Date(event.startDate));
    const endDateKey = createDateKey(new Date(event.endDate));
    addToGroup(startDateKey, event);
    if (endDateKey != startDateKey) {
      addToGroup(endDateKey, event);
    }
  });
  return groups;
};

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  useEffect(() => {
    loadUserEvents();
  }, []);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date2) - +new Date(date1)
    );
  }
  return groupedEvents && sortedGroupKeys ? (
    <div className="calendar">
      {sortedGroupKeys.map((dayKey, i) => {
        const events = groupedEvents ? groupedEvents[dayKey] : [];
        const groupDate = new Date(dayKey);
        const day = groupDate.getDate();
        const month = groupDate.toLocaleString(undefined, { month: "long" });
        return (
          <div key={i} className="calendar-day">
            <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
            </div>
            <div className="calendar-events">
              {events.map((event) => {
                return <EventItem key={`event_${event.id}`} event={event} />;
              })}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default connector(Calendar);
