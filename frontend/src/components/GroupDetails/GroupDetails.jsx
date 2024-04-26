import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGroupById, getAllGroupEvents } from "../../store";
import "./GroupDetails";

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

  console.log("group", group);

  let upcomingEvents, pastEvents, numEvents;
  if (Events) {
    upcomingEvents = Events.filter(
      (event) => new Date(event.startDate > new Date(Date.now()))
    );
    pastEvents = Events.filter(
      (event) => new Date(event.startDate) < new Date(Date.now())
    );
    numEvents = `${Events.length} event${Events.length === 1 ? "" : "s"}`;
  }

  const joinGroup = () => {
    alert("Feature coming soon");
  };
  const createEvent = () => {
    navigate(`/groups/${groupId}/events/new`);
  };
  const updateGroup = () => {
    navigate(`/groups/${groupId}/edit`);
  };

  return (
    <div className="group-details">
      <Breadcrumb to="/groups">Groups</Breadcrumb>
      <ShowImage url={url} type="hero" />
      {/* 
Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem assumenda, tempora nihil laborum recusandae ex necessitatibus eum rerum quae consectetur molestias corporis fuga dolorum, laudantium porro repellat vero. Recusandae, provident? A numquam amet quas illo?
 */}
      <div className="hero">
        <div className="hero-image">
          <img src="" alt="" />
        </div>
        <div className="hero-details">
          <div>
            <h2>{name}</h2>
            <p className="location">
              {city}, {state}
            </p>
            <p className="details">
              {numEvents} &middot; {group.private ? "Private" : "Public"}
            </p>
            <p className="details">
              Organized by {Organizer?.firstName} {Organizer?.lastName}
            </p>
          </div>
          {sessionUser && sessionUser.id === Organizer?.id ? (
            <div className="organizer-buttons">
              <button className="create-event" onClick={createEvent}>
                Create Event
              </button>
              <button className="update-group" onClick={updateGroup}>
                Update
              </button>
              <OpenModalButton
                buttonText="Delete Group"
                modalComponent={<DeleteGroupModal groupId={groupId} />}
              />
            </div>
          ) : sessionUser ? (
            <button className="hero-button" onClick={joinGroup}>
              Join this group
            </button>
          ) : null}
        </div>
      </div>
      <div className="group-details-wrapper">
        <div className="group-details">
          <h2>Organizer</h2>
          <p className="organizer">
            {Organizer?.firstName} {Organizer?.lastName}
          </p>
          <h2>What we&apos;re about</h2>
          <p className="description">{about}</p>
          {(!Events || !Events.length) && <h2>No Upcoming Events</h2>}
          {upcomingEvents && upcomingEvents.length > 0 && (
            <>
              <h2>Upcoming Events {upcomingEvents.length}</h2>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </>
          )}
          {pastEvents && pastEvents.length > 0 && (
            <>
              <h2>Past Events {pastEvents.length}</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
