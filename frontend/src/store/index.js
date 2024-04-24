import configureStore from "./store";
import {
  getAllGroups,
  getGroupById,
  getAllGroupEvents,
  deleteGroup,
} from "./groupsReducer";
import { getAllEvents } from "./eventsReducer";

export default configureStore;
export {
  getAllGroups,
  getGroupById,
  getAllGroupEvents,
  deleteGroup,
  getAllEvents,
};
