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
    await dispatch(deleteEvent(eventId))
      .then(() => closeModal())
      .then(() => navigate(`/groups/${groupId}`))
      .catch((errors) => {
        console.log("Delete event errors: ", errors);
      });

    // if (response?.ok) {
    //   console.log("Successfully deleted");
    //   navigate(`/groups/${groupId}`);
    //   closeModal();
    //   return;
    // } else {
    //   console.log("Error deleting event: ", response);
    //   return;
    // }
  };

  return (
    <div className="delete-event-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this event?</p>
      <button style={{ background: "red" }} onClick={submitDelete}>
        Yes (Delete event)
      </button>
      <button style={{ background: "grey" }} onClick={closeModal}>
        No (Keep event)
      </button>
    </div>
  );
};

export default DeleteEventModal;
