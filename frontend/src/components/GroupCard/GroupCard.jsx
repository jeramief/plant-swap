import { useNavigate } from "react-router-dom";
import "./GroupCard.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllGroupEvents } from "../../store";
import ShowImage from "../ShowImage";

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllGroupEvents(group.id));
  }, [dispatch, group]);

  const onClick = (groupId) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <div
      className="group-card"
      style={{ cursor: "pointer" }}
      onClick={() => onClick(group.id)}
    >
      <ShowImage url={group.previewImage} type="cart" />

      <div className="content">
        <h3>{group.name}</h3>
        <p className="location">
          {group.city}, {group.state}
        </p>
        <p className="description">{group.about}</p>
        <p className="details">
          {group?.Events?.length === 0 ? 0 : group?.Events?.length} event
          {group?.Events?.length === 1 ? "" : "s"} &middot;{" "}
          {group.private ? "Private" : "Public"}
        </p>
      </div>
    </div>
  );
};

export default GroupCard;
