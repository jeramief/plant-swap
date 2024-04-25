import { useNavigate } from "react-router-dom";
import "./GroupCard.css";
import ShowImage from "../ShowImage";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  const onClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div className="group-card" onClick={() => onClick(group.id)}>
      <ShowImage url={group.previewImage} type="cart" />

      <div className="content">
        <h3>{group.name}</h3>
        <p className="location">
          {group.city}, {group.state}
        </p>
        <p className="description">{group.about}</p>
        <p className="details">
          {group.numEvents} event{group.numEvents === 1 ? "" : "s"} &middot;{" "}
          {group.private ? "Private" : "Public"}
        </p>
      </div>
    </div>
  );
};

export default GroupCard;
