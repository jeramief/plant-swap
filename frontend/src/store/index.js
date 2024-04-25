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
import { getAllEvents } from "./eventsReducer";

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
};
