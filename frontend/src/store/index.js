import configureStore from "./store";
import {
  getAllGroups,
  getGroupById,
  getAllGroupEvents,
  createGroup,
  updateGroup,
  deleteGroup,
  newGroupImage,
} from "./groupsReducer";
import {
  getAllEvents,
  getEventById,
  createEvent,
  newEventImage,
  deleteEvent,
} from "./eventsReducer";

export default configureStore;
export {
  getAllGroups,
  getGroupById,
  getAllGroupEvents,
  createGroup,
  updateGroup,
  deleteGroup,
  newGroupImage,
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
  newEventImage,
};
