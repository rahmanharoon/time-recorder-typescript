import "./Recorder.css";
import cx from "classnames";
import { addZero } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { createUserEvent } from "../../redux/user-events";
import React, { useEffect, useRef, useState } from "react";
import { selectStartDate, start, stop } from "../../redux/recorder";

const Recorder = () => {
  const dispatch = useDispatch();
  const startDate = useSelector(selectStartDate);

  const [, setCount] = useState<number>(0);

  const started = startDate !== "";
  let interval = useRef<number>(0);

  const handleClick = () => {
    if (started) {
      window.clearInterval(interval.current);
      dispatch(createUserEvent());
      dispatch(stop());
    } else {
      dispatch(start());
      interval.current = window.setInterval(() => {
        setCount((count) => count + 1);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  let seconds = started
    ? Math.floor((Date.now() - new Date(startDate).getTime()) / 1000)
    : 0;
  const hours = seconds ? Math.floor(seconds / 60 / 60) : 0;
  seconds -= hours * 60 * 60;
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  seconds -= minutes * 60;
  return (
    <div className={cx("recorder", { "recorder-started": started })}>
      <button className="recorder-record" onClick={handleClick}>
        <span></span>
      </button>
      <div className="recorder-counter">
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
};

export default Recorder;
