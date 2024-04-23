import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { getAllGroups } from "../../store/groupsReducer";
// import { getAllEvents } from "../../store/eventsReducer";
import { getAllGroups, getAllEvents } from "../../store";
// import Group from "./Group";
// import GroupItem from '../GroupItem';
// import EventItem from '../EventItem';
import "./ListsIndex.css";
import GroupCard from "../GroupCard";
import EventCard from "../EventCard";

const ListIndex = ({ type }) => {
  const dispatch = useDispatch();
  const groupsActive = type === "group";
  const activeState = useSelector((state) =>
    groupsActive ? state.groupsState : state.eventsState
  );
  const list = Object.values(activeState);
  // console.log(list);

  useEffect(() => {
    const getList = () => (groupsActive ? getAllGroups() : getAllEvents());
    dispatch(getList());
  }, [dispatch, groupsActive]);

  return (
    <section className="list-container">
      <div className="events-and-groups-headings-container">
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/groups">Groups</NavLink>
      </div>
      <div>
        <p>{groupsActive ? "Groups" : "Events"} in Meetup</p>
      </div>
      <ul>
        {groupsActive
          ? list?.map((group) => (
              <li key={group.id}>
                <GroupCard group={group} />
              </li>
            ))
          : list?.map((event) => (
              <li key={event.id}>
                <EventCard event={event} />
              </li>
            ))}
        {/* {groups &&
          groups.map((group) => (
            // <li key={group.id}><Group groupData={group} /> </li>
          ))} */}
      </ul>
    </section>
  );
};

export default ListIndex;
