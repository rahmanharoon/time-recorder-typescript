import { useDispatch } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import {
  deleteUserEvent,
  updateUserEvent,
  UserEvent,
} from "../../redux/user-events";

interface Props {
  event: UserEvent;
}

const EventItem: React.FC<Props> = ({ event }) => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(event.title);

  useEffect(() => {
    if (editable) {
      inputRef.current?.focus();
    }
  }, [editable]);

  const handleDelete = () => {
    dispatch(deleteUserEvent(event.id));
  };

  const handleTitleClick = () => {
    setEditable(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBlur = () => {
    setEditable(false);
    if (title !== event.title) {
      dispatch(
        updateUserEvent({
          ...event,
          title,
        })
      );
    }
  };

  return (
    <div className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">
          {event.startDate} - {event.endDate}
        </div>
        <div className="calendar-event-title">
          {editable ? (
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ) : (
            <span onClick={handleTitleClick}>{title}</span>
          )}
        </div>
      </div>
      <button className="calendar-event-delete-button" onClick={handleDelete}>
        &times;
      </button>
    </div>
  );
};

export default EventItem;
