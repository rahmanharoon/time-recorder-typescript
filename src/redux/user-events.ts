import { Action } from "redux";
import { RootState } from "./store";
import { ThunkAction } from "redux-thunk";
import { selectStartDate } from "./recorder";

const LOAD_REQUEST = "userEvents/load_request";

const LOAD_SUCCESS = "userEvents/load_success";

const LOAD_FAILURE = "userEvents/load_failure";

const CRAETE_REQUEST = "userEvents/create_request";

const CRAETE_SUCCESS = "userEvents/create_success";

const CREATE_FAILURE = "userEvents/create_failure";

const DELETE_REQUEST = "userEvents/delete_request";

const DELETE_SUCCESS = "userEvents/delete_success";

const DELETE_FAILURE = "userEvents/delete_failure";

const UPDATE_REQUEST = "userEvents/update_request";

const UPDATE_SUCCESS = "userEvents/update_success";

const UPDATE_FAILURE = "userEvents/update_failure";

export interface UserEvent {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

interface UserEventsState {
  byIds: Record<UserEvent["id"], UserEvent>;
  allIds: UserEvent["id"][];
}

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}

interface LoadFailureAction extends Action<typeof LOAD_FAILURE> {
  error: string;
}

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: {
    events: UserEvent[];
  };
}

interface CreateRequestAction extends Action<typeof CRAETE_REQUEST> {}

interface CreateSuccessAction extends Action<typeof CRAETE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}

interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {}

interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}

interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: { id: UserEvent["id"] };
}

interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {}

interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> {}

interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: {
    event: UserEvent;
  };
}

interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {}

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};

export const createUserEvent =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    CreateRequestAction | CreateSuccessAction | CreateFailureAction
  > =>
  async (dispatch, getState) => {
    dispatch({
      type: CRAETE_REQUEST,
    });
    try {
      const startDate = selectStartDate(getState());
      const event: Omit<UserEvent, "id"> = {
        title: "No Name",
        startDate,
        endDate: new Date().toISOString(),
      };
      const response = await fetch(`http://localhost:3001/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      const createdEvent: UserEvent = await response.json();
      dispatch({
        type: CRAETE_SUCCESS,
        payload: { event: createdEvent },
      });
    } catch (error) {
      dispatch({
        type: CREATE_FAILURE,
      });
    }
  };

export const loadUserEvents =
  (): ThunkAction<
    void,
    RootState,
    undefined,
    LoadRequestAction | LoadSuccessAction | LoadFailureAction
  > =>
  async (dispatch, getState) => {
    dispatch({
      type: LOAD_REQUEST,
    });
    try {
      const response = await fetch("http://localhost:3001/events");
      const events: UserEvent[] = await response.json();
      dispatch({
        type: LOAD_SUCCESS,
        payload: { events },
      });
    } catch (err) {
      dispatch({
        type: LOAD_FAILURE,
        error: "Failed to load",
      });
    }
  };

export const deleteUserEvent =
  (
    id: UserEvent["id"]
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
  > =>
  async (dispatch) => {
    dispatch({
      type: DELETE_REQUEST,
    });

    try {
      const response = await fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch({
          type: DELETE_SUCCESS,
          payload: { id },
        });
      }
    } catch (e) {
      dispatch({ type: DELETE_FAILURE });
    }
  };

export const updateUserEvent =
  (
    event: UserEvent
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction
  > =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_REQUEST,
    });

    try {
      const response = await fetch(`http://localhost:3001/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });
      const updatedEvent: UserEvent = await response.json();

      dispatch({ type: UPDATE_SUCCESS, payload: { event: updatedEvent } });
    } catch (e) {
      dispatch({
        type: UPDATE_FAILURE,
      });
    }
  };

const userEventsReducer = (
  state: UserEventsState = initialState,
  action:
    | LoadSuccessAction
    | CreateSuccessAction
    | DeleteSuccessAction
    | UpdateSuccessAction
) => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventsState["byIds"]>((byIds, event) => {
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };
    case CRAETE_SUCCESS:
      const { event } = action.payload;
      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        byIds: { ...state.byIds },
        allIds: state.allIds.filter((StoreId) => StoreId !== id),
      };
      delete newState.byIds[id];
      return newState;
    case UPDATE_SUCCESS:
      const { event: updatedEvent } = action.payload;
      return {
        ...state,
        byIds: { ...state.byIds, [updatedEvent.id]: updatedEvent },
      };
    default:
      return state;
  }
};

export default userEventsReducer;
