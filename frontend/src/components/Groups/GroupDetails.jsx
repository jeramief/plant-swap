import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllGroups } from "../../store/groupsReducer";
import { Link } from "react-router-dom";
import Group from "./Group";

const GroupDetails = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groupsState[groupId]);
  // console.log(group);

  useEffect(() => {
    dispatch(getAllGroups());
  }, [dispatch]);

  return (
    group && (
      <div className="group-details-container">
        <Link to="/groups">Groups</Link>
        <Group groupData={group} />
        <div>
          <h3>Organizer</h3>
          <p>Firstname Lastname</p>

          <h4>What we&apos;re about</h4>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis
            cupiditate architecto obcaecati voluptatibus quis fuga delectus,
            fugiat labore magni? Quia quaerat illo corrupti velit aspernatur non
            pariatur fugiat, sapiente nam nostrum? In, vero voluptatem? Veniam!
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
            quae iusto deleniti atque iure sint, distinctio mollitia quos eum
            perspiciatis quas corporis sunt animi maiores?
          </p>
        </div>
      </div>
    )
  );
};

export default GroupDetails;
