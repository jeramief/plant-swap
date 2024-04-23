import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../../store/groupsReducer";
// import { getAllEvents } from "../../store/eventsReducer";
// import Group from "./Group";
// import "./Groups.css";

// import './ListIndex.css';
// import GroupItem from '../GroupItem';
// import EventItem from '../EventItem';

const ListIndex = () => {
  const dispatch = useDispatch();
  const groupsState = useSelector((state) => state.groupsState);
  const groups = Object.values(groupsState);
  // console.log(groups);

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  return (
    <section className="groups-list-container">
      <div className="events-and-groups-headings-container">
        <NavLink>
          <h2>Events</h2>
        </NavLink>
        <NavLink>
          <h2>Groups</h2>
        </NavLink>
      </div>
      <div>
        <p>Groups in Meetup</p>
      </div>
      <ul>
        {/* {groups?.map((group) => (
          <li key={group.id}>
            <Group groupData={group} />
          </li>
        ))} */}
        {groups &&
          groups.map((group) => (
            <li key={group.id}>{/* <Group groupData={group} /> */}</li>
          ))}
      </ul>
    </section>
  );
};

export default ListIndex;
