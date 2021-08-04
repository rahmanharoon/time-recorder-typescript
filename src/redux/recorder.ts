import { Action } from "redux";
import { RootState } from "./store";

interface RecorderState {
  startDate: string;
}

const initialState: RecorderState = {
  startDate: "",
};

const START = "recorder/start";
const STOP = "recorder/stop";

type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

export const start = (): StartAction => ({
  type: START,
});

export const stop = (): StopAction => ({
  type: STOP,
});

export const selectRecorderState = (rootState: RootState) => rootState.recorder;

export const selectStartDate = (rootState: RootState) =>
  selectRecorderState(rootState).startDate;

const recorderReducer = (
  state: RecorderState = initialState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case START:
      return { ...state, startDate: new Date().toISOString() };
    case STOP:
      return { ...state, startDate: "" };
    default:
      return state;
  }
};

export default recorderReducer;
