import { useNavigate } from "react-router-dom";
import "./EventCard.css";

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const onClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="event-card" onClick={() => onClick(event.id)}>
      <div className="event-card-main">
        <img src="" alt="" />
        <div className="event-content">
          <p className="date-time">{/* day and time */}</p>
          <h3>{event.name}</h3>
          <p className="location">
            {event.type.toLowerCase() === "online"
              ? "Online"
              : `${event.Group?.city}, ${event.Group?.state}`}
          </p>
        </div>
      </div>
      <p className="description">{event.description}</p>
    </div>
  );
};

export default EventCard;
