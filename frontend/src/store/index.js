import configureStore from "./store";
import { getAllGroups } from "./groupsReducer";
import { getAllEvents } from "./eventsReducer";

export default configureStore;
export { getAllGroups, getAllEvents };
