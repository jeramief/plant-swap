import React from "react";
import { useNavigate } from "react-router-dom";

const Group = ({ groupData }) => {
  const {
    id,
    previewImage,
    name,
    city,
    state,
    about,
    private: isPrivate,
  } = groupData;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/groups/${id}`);
  };

  return (
    <div className="group-container" onClick={handleClick}>
      <div className="group-image">
        <img src={previewImage} alt="Group Image" />
      </div>
      <div>
        <h3>{name}</h3>
        <p>
          Location: {city}, {state}
        </p>
        <p>Description: {about}</p>
        <div>
          <span>{"# of Events"}</span>
          <span> &bull; </span>
          <span>{isPrivate ? "Private" : "Public"}</span>
        </div>
      </div>
    </div>
  );
};

export default Group;
