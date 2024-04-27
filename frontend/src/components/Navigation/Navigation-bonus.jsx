import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton-bonus";
import "./Navigation.css";

import logo from "../../images/vector/default-monochrome-black.svg";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul className="nav">
      <li>
        <Link className="home-logo" to="/">
          <img src={logo} style={{ width: 100 + "px" }} alt="" />
        </Link>
      </li>
      {isLoaded && (
        <li>
          {sessionUser && (
            <Link
              to={"/groups/new"}
              onClick={(e) => (!sessionUser ? e.preventDefault() : null)}
            >
              Start a new group
            </Link>
          )}
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
