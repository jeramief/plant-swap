import configureStore from "./store";
import { getAllGroups, getGroupById, getAllGroupEvents } from "./groupsReducer";
import { getAllEvents } from "./eventsReducer";

export default configureStore;
export { getAllGroups, getGroupById, getAllGroupEvents, getAllEvents };
