import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

const ADD_EVENTS = "events/addEvents";
const DELETE_EVENT = "events/removeEvent";

const addEvents = (events) => ({
  type: ADD_EVENTS,
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
    dispatch(addEvents(events));
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
    dispatch(addEvents([event]));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const newEvent = (groupId, event) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(event),
  });

  if (response.ok) {
    const newEvent = await response.json();
    dispatch(addEvents([newEvent]));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const newEventImage = (eventId, image) => async (/*dispatch*/) => {
  const response = await csrfFetch(`/api/events/${eventId}/images`, {
    method: "POST",
    headers,
    body: JSON.stringify(image),
  });

  if (response.ok) {
    // const newImage = await response.json();
    // dispatch(getGroupById(groupId));
  } else {
    const errors = await response.json();
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
    case ADD_EVENTS: {
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
