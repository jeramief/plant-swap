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
    EventImages,
    description,
    type,
    price,
    // startDate,
    // endDate,
    Group,
  } = event;
  const previewImage = EventImages?.length ? EventImages[0].url : null;
  const groupPreviewImage = Group?.GroupImages?.find(
    (group) => group.preview === true
  ).url;
  console.log({ groupPreviewImage, previewImage });

  return (
    <div className="event-show">
      <div className="event-header">
        <Breadcrumb to="/events">Events</Breadcrumb>
        <h1>{name}</h1>
        <h3>
          Hosted by {Group?.Organizer?.firstName} {Group?.Organizer?.lastName}
        </h3>
      </div>
      <div className="event-details-wrapper">
        <div className="event-details">
          {previewImage && <ShowImage url={previewImage} type="hero" />}
          <div className="details-cards">
            <div
              className="Group-info-card"
              onClick={() => navigate(`/groups/${Group.id}`)}
            >
              <ShowImage url={groupPreviewImage} type="icon" />
              <div className="top-info">
                <h5>{Group?.name}</h5>
                <p className="details">
                  {Group?.private ? "Private" : "Public"}
                </p>
              </div>
            </div>
            <div className="event-info-card">
              <div className="time-details">
                <div className="icon-wrapper">
                  <i className="fa-2x fa-regular fa-clock" />
                </div>
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
              {sessionUser && sessionUser?.id === Group?.Organizer?.id && (
                <div className="organizer-buttons">
                  <button
                    style={{ background: "grey" }}
                    onClick={() => alert("Feature coming soon...")}
                  >
                    Update
                  </button>
                  <OpenModalButton
                    buttonText="Delete"
                    backgroundColor={"grey"}
                    modalComponent={
                      <DeleteEventModal eventId={eventId} groupId={Group?.id} />
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
