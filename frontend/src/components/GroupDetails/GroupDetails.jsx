import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGroupById, getAllGroupEvents } from "../../store";
import "./GroupDetails.css";

import OpenModalButton from "../OpenModalButton";
import DeleteGroupModal from "../DeleteGroupModal";
import EventCard from "../EventCard";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import ShowImage from "../ShowImage";

const GroupDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groupsState)[groupId];
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getGroupById(groupId)).then(() =>
      dispatch(getAllGroupEvents(groupId))
    );
  }, [dispatch, groupId]);

  if (!group) return null;
  const { GroupImages, name, city, state, Organizer, about, Events } = group;
  const url = GroupImages ? GroupImages[0]?.url : undefined;
  // console.log({ GroupImages, name, city, state, Organizer, about, Events });

  let upcomingEvents, pastEvents;
  if (Events) {
    upcomingEvents = Events.filter(
      (event) => Date.parse(event.startDate) > Date.now()
    );
    pastEvents = Events.filter(
      (event) => Date.parse(event.startDate) < Date.now()
    );
    // numEvents = `${Events.length} event${Events.length === 1 ? "" : "s"}`;
    upcomingEvents.sort(
      (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
    );
    pastEvents.sort(
      (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
    );
  }

  const joinGroup = () => {
    alert("Feature coming soon");
  };
  const createEvent = () => {
    navigate(`/groups/${groupId}/events/new`);
  };
  const updateGroup = () => {
    if (Organizer?.id !== sessionUser?.id) {
      navigate("/");
    } else {
      navigate(`/groups/${groupId}/edit`);
    }
  };
  // console.log({ upcomingEvents });

  return (
    <div className="group-details">
      <Breadcrumb to="/groups">Groups</Breadcrumb>
      <div className="group-details-hero">
        <ShowImage url={url} type="group-details-hero" />
        <div className="group-details-hero-details">
          <div>
            <h2>{name}</h2>
            <p className="group-details-location">
              {city}, {state}
            </p>
            <p className="group-details-details">
              {Events?.length} events &middot;{" "}
              {group.private ? "Private" : "Public"}
            </p>
            <p className="group-details-details">
              Organized by {Organizer?.firstName} {Organizer?.lastName}
            </p>
          </div>
          {sessionUser && sessionUser.id === Organizer?.id ? (
            <div className="group-details-organizer-buttons">
              <button
                className="group-details-create-event"
                style={{ background: "grey" }}
                onClick={createEvent}
              >
                Create event
              </button>
              <button
                className="group-details-update-group"
                style={{ background: "grey" }}
                onClick={updateGroup}
              >
                Update
              </button>
              <OpenModalButton
                backgroundColor="grey"
                buttonText="Delete"
                modalComponent={<DeleteGroupModal groupId={groupId} />}
              />
            </div>
          ) : sessionUser ? (
            <button
              className="group-details-hero-button"
              style={{ background: "red" }}
              onClick={joinGroup}
            >
              Join this group
            </button>
          ) : null}
        </div>
      </div>
      <div className="group-details-wrapper">
        <div className="group-details-group-details">
          <h2>Organizer</h2>
          <p className="group-details-organizer">
            {Organizer?.firstName} {Organizer?.lastName}
          </p>
          <h2>What we&apos;re about</h2>
          <p className="group-details-description">{about}</p>
          <div className="events-list">
            {Events && <h2>Events ({Events?.length})</h2>}
            {upcomingEvents &&
              upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            {pastEvents &&
              pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
