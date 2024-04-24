import configureStore from "./store";
import {
  getAllGroups,
  getGroupById,
  getAllGroupEvents,
  deleteGroup,
  createGroup,
  newGroupImage,
} from "./groupsReducer";
import { getAllEvents } from "./eventsReducer";

export default configureStore;
export {
  getAllGroups,
  getGroupById,
  getAllGroupEvents,
  createGroup,
  deleteGroup,
  newGroupImage,
  getAllEvents,
};
