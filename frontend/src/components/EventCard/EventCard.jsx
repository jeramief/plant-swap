import { useNavigate } from "react-router-dom";
import "./EventCard.css";

import ShowImage from "../ShowImage";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const onClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const dateAndTime = new Date(event.startDate).toLocaleString().split(", ");
  const date = dateAndTime[0];
  const time = `${dateAndTime[1]
    .split(" ")
    .slice(0, 1)
    .join("")
    .split("")
    .reverse()
    .slice(3)
    .reverse()
    .join("")} ${dateAndTime[1].split(" ").slice(1).join("")}`;

  return (
    <div
      className="event-card"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(event.id)}
    >
      <div className="event-card-main-details">
        <ShowImage url={event.previewImage} type={"cart"} />
        <div className="event-card-main">
          <div className="event-content">
            <span className="date-time">{date}</span> <span>&middot;</span>{" "}
            <span className="date-time">{time}</span>
            <h3>{event.name}</h3>
            <p className="location">
              {event.type.toLowerCase() === "online"
                ? "Online"
                : `${event.Group?.city}, ${event.Group?.state}`}
            </p>
          </div>
        </div>
      </div>
      <p className="description">{event.description}</p>
    </div>
  );
};

export default EventCard;
