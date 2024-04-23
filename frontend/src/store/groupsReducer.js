import { csrfFetch } from "./csrf";

const headers = {
  "Content-Type": "application/json",
};

const LOAD_GROUPS = "groups/loadGroups";
const DELETE_GROUP = "groups/removeGroup";
const ADD_GROUP_EVENTS = "groups/addGroupEvents";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});
const removeGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});
const addGroupEvents = (groupId, events) => ({
  type: ADD_GROUP_EVENTS,
  groupId,
  events,
});

export const getAllGroups = () => async (dispatch) => {
  const response = await csrfFetch(`/api/groups`);

  if (response.ok) {
    const groups = await response.json();

    dispatch(loadGroups(groups));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const getGroupById = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);

  if (response.ok) {
    const group = await response.json();
    dispatch(loadGroups([group]));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const getGroupEvents = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}/events`);

  if (response.ok) {
    const { Events: events } = await response.json();
    dispatch(addGroupEvents(+groupId, events));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const createGroup = (group) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups`, {
    method: "POST",
    headers,
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const newGroup = await response.json();
    dispatch(loadGroups([newGroup]));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const updateGroup = (groupId, group) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(group),
  });

  if (response.ok) {
    const newGroup = await response.json();
    dispatch(loadGroups([newGroup]));
    return newGroup;
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};
export const deleteGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeGroup(+groupId));
  } else {
    const errors = await response.json();
    console.log(errors);
    return errors;
  }
};

const initialState = {};

function groupsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GROUPS: {
      const newState = { ...state };
      action.groups.forEach((group) => (newState[group.id] = group));
      return newState;
    }
    case DELETE_GROUP: {
      if (state[action.groupId] === undefined) return state;

      const newState = { ...state };
      delete newState[action.groupId];
      return newState;
    }
    case ADD_GROUP_EVENTS: {
      if (state[action.groupId] === undefined) return state;

      const newState = { ...state };
      newState[action.groupId].Events = action.events;
      return newState;
    }
    default:
      return state;
  }
}

export default groupsReducer;
