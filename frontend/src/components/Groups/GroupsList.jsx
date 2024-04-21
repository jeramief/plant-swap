import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Groups.css";
import { getAllGroups } from "../../store/groupsReducer";

const GroupsList = () => {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groupsState.Groups);
  //   const groups = Object.values(state);
  console.log(groups);

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  return (
    <section className="groups-list-container">
      <div className="events-and-groups-headings-container">
        <NavLink>
          <h2>Events</h2>
        </NavLink>
        <NavLink isActive>
          <h2>Groups</h2>
        </NavLink>
      </div>
      <div>
        <p>Groups in Meetup</p>
      </div>
      <ul>
        {groups?.map((group) => (
          <li key={group.id} className="group-container">
            <div className="group-image">
              <img src={group.previewImage} alt="Group Image" />
            </div>
            <div>
              <h3>{group.name}</h3>
              <p>
                Location: {group.city}, {group.state}
              </p>
              <p>Description: {group.about}</p>
              <div>
                <span>{"# of Events"}</span>
                <span> &bull; </span>
                <span>{group.private ? "Private" : "Public"}</span>
              </div>
            </div>
          </li>
        ))}
        {/* {groups &&
          groups.map((group) => {
            <li className="group-container">
              <img src={group.previewImage} alt="Group Image" />
              <h3>{group.name}</h3>
            </li>;
          })} */}
      </ul>
    </section>
  );
};

export default GroupsList;
