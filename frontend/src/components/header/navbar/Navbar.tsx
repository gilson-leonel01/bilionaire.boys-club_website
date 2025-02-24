import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/membership">Membership</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/eventlisting">Event Listing</Link></li>
        <li><Link to="/eventdetail">Event Detail</Link></li>
        <li><Link to="/contacts">Contact Us</Link></li>
      </ul>
    </nav>
  );
};
