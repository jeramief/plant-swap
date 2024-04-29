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

  const startDateAndTime = new Date(event.startDate)
    .toLocaleString()
    .split(", ");
  const startDateConvert = startDateAndTime[0];
  const startTimeConvert = `${startDateAndTime[1]
    .split(" ")
    .slice(0, 1)
    .join("")
    .split("")
    .reverse()
    .slice(3)
    .reverse()
    .join("")} ${startDateAndTime[1].split(" ").slice(1).join("")}`;
  const endDateAndTime = new Date(event.startDate).toLocaleString().split(", ");
  const endDateConvert = endDateAndTime[0];
  const endTimeConvert = `${endDateAndTime[1]
    .split(" ")
    .slice(0, 1)
    .join("")
    .split("")
    .reverse()
    .slice(3)
    .reverse()
    .join("")} ${endDateAndTime[1].split(" ").slice(1).join("")}`;

  return (
    <div className="event-details">
      <div className="event-header">
        <Breadcrumb to="/events">Events</Breadcrumb>
        <h1>{name}</h1>
        <h3>
          Hosted by {Group?.Organizer?.firstName} {Group?.Organizer?.lastName}
        </h3>
      </div>
      <div className="event-details-wrapper">
        <div className="event-details">
          {previewImage && (
            <ShowImage
              style={{ width: "25%" }}
              url={previewImage}
              type="event-details-preview"
            />
          )}
          <div className="details-cards">
            <div
              className="Group-info-card"
              onClick={() => navigate(`/groups/${Group.id}`)}
            >
              <ShowImage
                style={{ width: "50%" }}
                url={groupPreviewImage}
                type="icon"
              />
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
                    <p>{startDateConvert}</p>
                    <p>&middot;</p>
                    <p>{startTimeConvert}</p>
                  </div>
                  <div className="event-time">
                    <h6>END</h6>
                    <p>{endDateConvert}</p>
                    <p>&middot;</p>
                    <p>{endTimeConvert}</p>
                  </div>
                </div>
              </div>
              <div className="cost-details">
                <div className="icon-wrapper">
                  <i className="fa-2x fa-solid fa-dollar-sign" />
                </div>
                <p>
                  {price !== undefined
                    ? Number(price) === 0
                      ? "FREE"
                      : Number(price).toFixed(2)
                    : ""}
                </p>
              </div>
              <div className="async-details">
                <div className="icon-wrapper">
                  <i className="fa-2x fa-solid fa-map-pin" />
                </div>
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
          <h2>Description</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
