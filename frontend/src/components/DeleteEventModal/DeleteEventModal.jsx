import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteEvent } from "../../store";
import "./DeleteEventModal.css";

const DeleteEventModal = ({ eventId, groupId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const submitDelete = async () => {
    const response = await dispatch(deleteEvent(eventId));

    if (response.ok) {
      console.log("Successfully deleted");
      navigate(`/groups/${groupId}`);
      closeModal();
      return;
    } else {
      console.log("Error deleting group: ", response);
      return;
    }
  };

  return (
    <div>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this event?</p>
      <button onClick={submitDelete}>Yes (Delete event)</button>
      <button onClick={closeModal}>No (Keep event)</button>
    </div>
  );
};

export default DeleteEventModal;
