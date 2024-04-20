import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./Landing.css";

function Landing() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.user);

  return (
    <section>
      <div className="section-one">
        <div className="section-one-left">
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

      <div className="section-two">
        <h3>Section 2</h3>
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>

      <div className="section-three">
        <div className="go-to-groups">
          <img src="" alt="section 3 image" />
          <Link>See all groups</Link>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className="go-to-events">
          <img src="" alt="section 3 image" />
          <Link>Find an event</Link>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
        <div className="start-group">
          <img src="" alt="section 3 image" />
          <Link>Start a group</Link>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        </div>
      </div>

      <div className="sectionFour">
        <button>Join PlantSwap</button>
      </div>
    </section>
  );
}

export default Landing;
