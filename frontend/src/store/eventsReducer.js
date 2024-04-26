import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

const LOAD_EVENTS = "events/loadEvents";
const DELETE_EVENT = "events/removeEvent";

const loadEvents = (events) => ({
  type: LOAD_EVENTS,
  events,
});
const removeEvent = (eventId) => ({
  type: DELETE_EVENT,
  eventId,
});

export const getAllEvents = () => async (dispatch) => {
  const response = await csrfFetch("/api/events");

  if (response.ok) {
    const { Events: events } = await response.json();
    dispatch(loadEvents(events));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const getEventById = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`);

  if (response.ok) {
    const event = await response.json();
    dispatch(loadEvents([event]));
    console.log("event from thunk", event);
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const createEvent = (groupId, event) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
    });

    const newEvent = await response.json();
    dispatch(loadEvents([newEvent]));
    return newEvent;
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const newEventImage = (eventId, image) => async (/*dispatch*/) => {
  try {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
      method: "POST",
      headers,
      body: JSON.stringify(image),
    });

    return response.json();
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const deleteEvent = (eventId) => async (dispatch) => {
  const response = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeEvent(+eventId));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};

const initialState = {};

function eventsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_EVENTS: {
      const newState = { ...state };
      action.events.forEach((event) => (newState[event.id] = event));
      return newState;
    }
    case DELETE_EVENT: {
      if (state[action.eventId] === undefined) return state;
      const newState = { ...state };
      delete newState[action.eventId];
      return newState;
    }
    default:
      return state;
  }
}

export default eventsReducer;
