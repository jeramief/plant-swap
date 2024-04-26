import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEventById } from "../../store";
import "./EventDetails.css";

import Breadcrumb from "../Breadcrumb";
import ShowImage from "../ShowImage";
import OpenModalButton from "../OpenModalButton";
import DeleteEventModal from "../DeleteEventModal";

const EventDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const event = useSelector((state) => state.eventsState)[eventId];
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getEventById(eventId));
  }, [dispatch, eventId]);

  if (!event || !event.id) return null;

  const {
    name,
    EventImages: images,
    description,
    type,
    price,
    // startDate,
    // endDate,
    Group: group,
  } = event;

  return (
    <div className="event-show">
      <div className="event-header">
        <Breadcrumb to="/events">Events</Breadcrumb>
        <h1>{name}</h1>
        <h3>
          Hosted by {group?.Organizer?.firstName} {group?.Organizer?.lastName}
        </h3>
      </div>
      <div className="event-details-wrapper">
        <div className="event-details">
          <ShowImage url={images?.[0]?.url} type="hero" />
          <div className="details-cards">
            <div
              className="group-info-card"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <ShowImage url={group?.GroupImages?.[0].url} type="icon" />
              <div className="top-info">
                <h5>{group?.name}</h5>
                <p className="details">
                  {group?.private ? "Private" : "Public"}
                </p>
              </div>
            </div>
            <div className="event-info-card">
              <div className="time-details">
                <div className="event-times">
                  <div className="event-time">
                    <h6>START</h6>
                    {/* <p>{startDay}</p> */}
                    <p>&middot;</p>
                    {/* <p>{startTime}</p> */}
                  </div>
                  <div className="event-time">
                    <h6>END</h6>
                    {/* <p>{endDay}</p> */}
                    <p>&middot;</p>
                    {/* <p>{endTime}</p> */}
                  </div>
                </div>
              </div>
              <div className="cost-details">
                <p>
                  {price !== undefined
                    ? Number(price) === 0
                      ? "FREE"
                      : Number(price).toFixed(2)
                    : ""}
                </p>
              </div>
              <div className="async-details">
                <p>{type === "In Person" ? "In Person" : "Online"}</p>
              </div>
              {sessionUser && sessionUser?.id === group?.organizerId && (
                <div className="organizer-buttons">
                  <button onClick={() => alert("Feature coming soon...")}>
                    Update Event
                  </button>
                  <OpenModalButton
                    buttonText="Delete Event"
                    modalComponent={
                      <DeleteEventModal eventId={eventId} groupId={group?.id} />
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="event-description">
          <h2>Details</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
