import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Landing.css";

const heroImage =
  "https://res.cloudinary.com/dammgkvnx/image/upload/v1714261044/iu_igdf7q.jpg";

import ShowImage from "../ShowImage/ShowImage";

function Landing() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <section className="landing-page-container">
      {/* --------------------HERO------------------- */}
      <div className="landing-page-hero-container">
        <div className="landing-page-hero-text-container">
          <h1 className="landing-page-hero-heading">
            Check Off Your Plant Wish List With <i>Plant Swap</i>
          </h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Laudantium, possimus? Corporis error ducimus obcaecati harum, iusto
            officia voluptatem, repellat sapiente cum cupiditate reiciendis
            voluptas laboriosam eius nobis quae consequuntur quam.
          </p>
        </div>
        <ShowImage url={heroImage} type="landing-page-hero" />
      </div>
      {/* --------------------HERO------------------- */}

      {/* --------------------INFO--------------------- */}
      <div className="landing-page-info-container">
        <h3>How PlantSwap Works</h3>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      {/* --------------------INFO--------------------- */}

      {/* --------------------GROUPS AND EVENTS-------- */}
      <div className="landing-page-groups-and-events-container">
        <Link className="go-to-groups-container" to="/groups">
          <ShowImage url={heroImage} type="to-groups-list" />
          <span>See all groups</span>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </Link>
        <Link className="go-to-events-container" to="/events">
          <ShowImage url={heroImage} type="to-events-list" />
          <span>Find an event</span>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </Link>
        <Link
          className={`start-group-container${sessionUser ? "" : "-grey"}`}
          to={"/groups/new"}
          onClick={(e) => (!sessionUser ? e.preventDefault() : null)}
        >
          <ShowImage url={heroImage} type="create-group" />
          <span> Start a group</span>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </Link>
      </div>
      {/* --------------------GROUPS AND EVENTS-------- */}

      {/* --------------------JOIN BUTTON-------------- */}
      {/* {!sessionUser && ( */}
      <div className="landing-page-join-button-container">
        <button>Join PlantSwap</button>
      </div>
      {/* )} */}
      {/* --------------------JOIN BUTTON-------------- */}
    </section>
  );
}

export default Landing;
