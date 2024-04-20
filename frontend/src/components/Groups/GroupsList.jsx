import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Groups.css";

const GroupsList = () => {
  const groups = useSelector((state) => state);
  console.log(groups);

  return (
    <section className="groups-list-container">
      <h1>Hello World</h1>
    </section>
  );
};

export default GroupsList;
