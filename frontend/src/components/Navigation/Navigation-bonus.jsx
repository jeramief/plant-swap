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
          {logo && <img src={logo} alt="" />}
        </Link>
      </li>
      {isLoaded && (
        <li className="start-group-and-user-modal">
          {sessionUser && (
            <Link
              className="nav-start-group"
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
