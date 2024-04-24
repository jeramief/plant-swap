import { NavLink } from "react-router-dom";
import "./Breadcrumb.css";

const Breadcrumb = ({ to, children }) => {
  return (
    <div className="breadcrumb">
      {/* icon */}
      <NavLink to={to}>{children}</NavLink>
    </div>
  );
};

export default Breadcrumb;
