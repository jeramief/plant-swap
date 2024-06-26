import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createGroup, newGroupImage } from "../../store";
import "./GroupCreate";

const GroupCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("");
  const [isPrivate, setIsPrivate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [validations, setValidations] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const errorsArray = [];
    const validationsObject = {};

    if (location.split(", ").length !== 2 || !location.split(", ")[1]) {
      errorsArray.push("City and State required in the format of: City, State");
      validationsObject.location =
        "City and State required in the format of: City, State";
    }
    if (!location) {
      errorsArray.push("Location is required");
      validationsObject.location = "Location is required";
    }
    if (!name) {
      errorsArray.push("Name is required");
      validationsObject.name = "Name is required";
    }
    if (about.length < 30) {
      errorsArray.push("Description must be at least 50 characters");
      validationsObject.about = "Descrition must be at least 50 characters";
    }
    if (!type) {
      errorsArray.push("Group type is required");
      validationsObject.type = "Group type is required";
    }
    if (!isPrivate) {
      errorsArray.push("Group privacy is required");
      validationsObject.private = "Group privacy is required";
    }
    if (!imageUrl) {
      errorsArray.push("Group image is required");
      validationsObject.imageUrl = "Group image is required";
    }

    setFormErrors(errorsArray);
    setValidations(validationsObject);
  }, [about, imageUrl, isPrivate, location, name, type]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    if (formErrors.length) return;

    const [city, state] = location.split(", ");

    const group = {
      name,
      about,
      type,
      private: isPrivate,
      city,
      state,
    };
    // console.log('Group', group);

    const image = {
      url: imageUrl,
      preview: true,
    };

    const newGroup = await dispatch(createGroup(group));

    if (!newGroup.id) {
      const { errors } = await newGroup.json();
      if (errors.city) errors.location = errors.city;
      if (errors.state)
        errors.location = errors.location
          ? errors.location + " " + errors.state
          : errors.state;
      console.log("Group creation failed", errors);
      setValidations(errors);
      setFormErrors(errors);
      return;
    }

    const newImage = await dispatch(newGroupImage(newGroup.id, image));

    if (!newImage?.id) {
      const { errors } = await newImage.json();
      console.log("Error Response", errors);
      setFormErrors(errors);
      return;
    }

    console.log("Group Image", newImage);

    navigate(`/groups/${newGroup.id}`);
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div className="form-section">
          <h1>Sart a New Group</h1>
        </div>
        <div className="breakline"></div>
        <div className="form-section">
          <h2>Set your group&apos;s location</h2>
          <p>
            PlantSwap groups meet locally, in person and online. We&apos;ll
            connect you with people in your area.
          </p>
          <input
            type="text"
            placeholder="City, STATE"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {submitted && validations?.location && (
            <p className="error">{validations?.location}</p>
          )}
        </div>
        <div className="breakline"></div>
        <div className="form-section">
          <h2>What will your group&apos;s name be?</h2>
          <p>
            Choose a name that will give people a clear idea of what the group
            is about.
            <br />
            Feel free to get creative! You can edit this later if you change
            your mind.
          </p>
          <input
            type="text"
            placeholder="What is your group name?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {submitted && validations?.name && (
            <p className="error">{validations?.name}</p>
          )}
        </div>
        <div className="breakline"></div>
        <div className="form-section">
          <h2>Describe the purpose of your group.</h2>
          <p>
            People will see this when we promote your group, but you&apos;ll be
            able to add to it later, too.
          </p>
          <ol>
            <li>What&apos;s the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            placeholder="Please write at least 30 characters"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          {submitted && validations?.about && (
            <p className="error">{validations?.about}</p>
          )}
        </div>
        <div className="breakline"></div>
        <div className="form-section final-steps">
          <h2>Final steps...</h2>

          <div className="select-group">
            <p>Is this an in person or online group?</p>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="" disabled>
                (select one)
              </option>
              <option value="In person">In person</option>
              <option value="Online">Online</option>
            </select>
            {submitted && validations?.type && (
              <p className="error">{validations?.type}</p>
            )}
          </div>

          <div className="select-group">
            <p>Is this group private or public?</p>
            <select
              value={isPrivate}
              onChange={(e) => setIsPrivate(e.target.value)}
            >
              <option value="" disabled>
                (select one)
              </option>
              <option value="true">Private</option>
              <option value="false">Public</option>
            </select>
            {submitted && validations?.private && (
              <p className="error">{validations?.private}</p>
            )}
          </div>

          <p>Please add an image url for your group below:</p>
          <input
            type="text"
            placeholder="Image Url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          {submitted && validations?.imageUrl && (
            <p className="error">{validations?.imageUrl}</p>
          )}
        </div>
        <div className="breakline"></div>
        <button>Create Group</button>
      </form>
    </div>
  );
};

export default GroupCreate;
