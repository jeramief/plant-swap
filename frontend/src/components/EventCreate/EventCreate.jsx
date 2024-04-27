import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getGroupById, createEvent, newEventImage } from "../../store";
import "./EventCreate.css";

function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  // const [isPrivate, setIsPrivate] = useState("");
  const [price, setPrice] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const { groupId } = useParams();
  const group = useSelector((state) => state.groupsState)[groupId];

  useEffect(() => {
    dispatch(getGroupById(groupId));
  }, [groupId, dispatch]);

  function validateInputs() {
    const validationErrors = {};

    if (!name) validationErrors.name = "Name is required";
    if (!type) validationErrors.type = "Event type is required";
    // if (!isPrivate) validationErrors.private = "Visibility is required";
    if (!price.toString()) validationErrors.price = "Price is required";
    if (!start) validationErrors.startDate = "Event start is required";
    if (!end) validationErrors.endDate = "Event end is required";
    if (!url) validationErrors.url = "Image URL is required";
    if (description.length < 30)
      validationErrors.description = "Description needs 30 or more characters";

    setErrors(validationErrors);

    return !Object.keys(validationErrors).length;
  }

  useEffect(() => {
    if (!submitted) {
      if (description.length && description.length < 30)
        setErrors({
          description: "Description must be at least 30 characters",
        });
      else setErrors({});
      return;
    }

    const validationErrors = {};

    if (!name) validationErrors.name = "Name is required";
    if (!type) validationErrors.type = "Event type is required";
    // if (!isPrivate) validationErrors.private = "Visibility is required";
    if (!price.toString()) validationErrors.price = "Price is required";
    if (!start) validationErrors.startDate = "Event start is required";
    if (!end) validationErrors.endDate = "Event end is required";
    if (!url) validationErrors.url = "Image URL is required";
    if (description.length < 30)
      validationErrors.description = "Description needs 30 or more characters";

    setErrors(validationErrors);
  }, [name, type, price, start, end, url, description, submitted]);

  if (!group) return null;

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateInputs()) {
      setSubmitted(true);
      return;
    }

    const event = {
      name,
      type,
      price,
      startDate: start,
      endDate: end,
      description,
      capacity: 10,
      venueId: 1,
    };

    const image = {
      url,
      preview: true,
    };

    const newEvent = await dispatch(createEvent(groupId, event));
    console.log({ newEvent });
    if (!newEvent?.id) {
      const { errors } = await newEvent.json();
      console.log("Event creation failed", errors);
      setErrors(errors);
      return;
    }

    // console.log('New event', newEvent);

    const newImage = await dispatch(newEventImage(newEvent.id, image));

    if (!newImage.id) {
      const { errors } = await newImage.json();
      console.log("Image failed to save", errors);
      // setErrors(errors);
      // return;
    }

    // console.log('Event Image', newImage);

    navigate(`/events/${newEvent.id}`);
  }

  return (
    <div className="create-event-page">
      <h1>Create a new event for {group.name}</h1>
      <form onSubmit={onSubmit}>
        <div className="form-section">
          <label>
            What is the name of your event?
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Event Name"
            />
          </label>
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div className="form-section">
          <label>
            Is this an in-person or online event?
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="" disabled>
                ( select one )
              </option>
              <option value="In Person">In person</option>
              <option value="Online">Online</option>
            </select>
          </label>
          {errors.type && <p className="error">{errors.type}</p>}

          {/* <label>
            Is this event private or public?
            <select
              name="isPrivate"
              value={isPrivate}
              onChange={(e) => setIsPrivate(e.target.value)}
            >
              <option value="" disabled>
                ( select one )
              </option>
              <option value="false">Public</option>
              <option value="true">Private</option>
            </select>
          </label>
          {errors.private && <p className="error">{errors.private}</p>} */}

          <label>
            What is the price for your event?
            <div id="price-input-container">
              <div id="price-input-dollar">$</div>
              <input
                id="event-price"
                type="number"
                min={0}
                step={0.01}
                value={price}
                onChange={(e) => setPrice(+e.target.value)}
                placeholder="0"
              />
            </div>
          </label>
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div className="form-section">
          <label>
            When does your event start?
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="MM/DD/YYYY HH:mm AM"
            />
          </label>
          {errors.startDate && <p className="error">{errors.startDate}</p>}

          <label>
            When does your event end?
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              placeholder="MM/DD/YYYY HH:mm PM"
            />
          </label>
          {errors.endDate && <p className="error">{errors.endDate}</p>}
        </div>

        <div className="form-section">
          <label>
            Please add in image url for your event below:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Image URL"
            />
          </label>
          {errors.url && <p className="error">{errors.url}</p>}
        </div>

        <label>
          Please describe your event:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please include at least 30 characters"
          />
        </label>
        {errors.description && <p className="error">{errors.description}</p>}
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEvent;
