import { csrfFetch } from "./csrf";

const LOAD_GROUPS = "groups/loadGroups";
const DELETE_GROUP = "groups/removeGroup";
const GET_GROUP_EVENTS = "groups/getGroupEvents";

const loadGroups = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});
const removeGroup = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});
const getGroupEvents = (groupId, events) => ({
  type: GET_GROUP_EVENTS,
  groupId,
  events,
});

export const getAllGroups = () => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups`);
    const groups = await response.json();
    dispatch(loadGroups(groups.Groups));
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const getGroupById = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`);

    const group = await response.json();
    dispatch(loadGroups([group]));
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const getAllGroupEvents = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    const { Events: events } = await response.json();
    dispatch(getGroupEvents(+groupId, events));
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const createGroup = (group) => async (dispatch) => {
  try {
    // console.log({ group });

    const response = await csrfFetch("/api/groups", {
      method: "POST",
      body: JSON.stringify(group),
    });

    console.log({ response });

    const newGroup = await response.json();
    console.log(newGroup);
    dispatch(loadGroups([newGroup]));
    return newGroup;
  } catch (errors) {
    console.log({ errors });
    return errors;
  }
};
export const updateGroup = (groupId, group) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(group),
    });

    const newGroup = await response.json();
    dispatch(loadGroups([newGroup]));
    return newGroup;
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const deleteGroup = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    dispatch(removeGroup(+groupId));
    return response;
  } catch (errors) {
    console.log(errors);
    return errors;
  }
};
export const newGroupImage = (groupId, image) => async () => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "POST",
      body: JSON.stringify(image),
    });

    return response;
  } catch (errors) {
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
    case GET_GROUP_EVENTS: {
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
