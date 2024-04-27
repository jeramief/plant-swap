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
  let upcomingEvents, pastEvents, eventList;
  if (!groupsActive) {
    console.log({ list });
    upcomingEvents = list?.filter(
      (event) => Date.parse(event.startDate) > Date.now()
    );
    pastEvents = list?.filter(
      (event) => Date.parse(event.startDate) < Date.now()
    );
    upcomingEvents.sort(
      (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
    );
    pastEvents.sort(
      (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
    );
    eventList = [...upcomingEvents, ...pastEvents];
  }

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
                <div
                  className="breakline"
                  style={{ border: "1px solid green" }}
                ></div>
                <GroupCard group={group} />
              </li>
            ))
          : eventList?.map((event) => (
              <li key={event.id}>
                <div
                  className="breakline"
                  style={{ border: "1px solid green" }}
                ></div>
                <EventCard event={event} />
              </li>
            ))}
      </ul>
    </section>
  );
};

export default ListIndex;
