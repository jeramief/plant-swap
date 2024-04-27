import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteGroup } from "../../store";
import "./DeleteGroupModal.css";

const DeleteGroupModal = ({ groupId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const submitDelete = async () => {
    await dispatch(deleteGroup(groupId))
      .then(() => closeModal())
      .then(() => navigate(`/groups`))
      .catch((errors) => {
        console.log("Delete event errors: ", errors);
      });
    //   const response = await dispatch(deleteGroup(groupId));
    // if (response.ok) {
    //   console.log("Successfully deleted");
    //   navigate("/groups");
    //   closeModal();
    //   return;
    // } else {
    //   console.log("Error deleting group: ", response);
    //   return;
    // }
  };

  return (
    <div style={{ background: "gray" }}>
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to remove this group?</p>
      <button style={{ background: "red" }} onClick={submitDelete}>
        Yes (Delete group)
      </button>
      <button style={{ background: "grey" }} onClick={closeModal}>
        No (Keep group)
      </button>
    </div>
  );
};

export default DeleteGroupModal;
