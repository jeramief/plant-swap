import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Landing.css";

function Landing() {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <section className="landing-page-container">
      <div className="landing-page-banner-container">
        <div className="landing-page-text-container">
          <h1>Section 1</h1>
          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Laudantium, possimus? Corporis error ducimus obcaecati harum, iusto
            officia voluptatem, repellat sapiente cum cupiditate reiciendis
            voluptas laboriosam eius nobis quae consequuntur quam.
          </p>
        </div>
        <img src="img" alt="Section 1 image" />
      </div>

      <div className="landing-page-info-container">
        <h3>Section 2</h3>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>

      <div className="landing-page-groups-and-events-container">
        <div className="go-to-groups-container">
          <img src="" alt="section 3 image" />
          <Link to="/groups">See all groups</Link>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className="go-to-events-container">
          <img src="" alt="section 3 image" />
          <Link to="/events">Find an event</Link>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className="start-group-container">
          <img src="" alt="section 3 image" />

          {/* prevents a non active user from creating a group */}
          <Link
            to={"/groups/new"}
            onClick={(e) => (!sessionUser ? e.preventDefault() : null)}
          >
            Start a group
          </Link>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>

      <div className="landing-page-join-button-container">
        <button>Join PlantSwap</button>
      </div>
    </section>
  );
}

export default Landing;
