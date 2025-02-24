import { 
  BrowserRouter as Router, 
  Routes as Routers, 
  Route 
} from "react-router-dom";
  
import Home from "../pages/home/Home";
import About from "../pages/about/About";
import Contacts from "../pages/contacts/Contacts";
import Membership from "../pages/membership/MemberShip";
import Events from "../pages/events/Events";
import EventListing from "../pages/events/eventListing/EventListing";
import EventDetail from "../pages/events/eventDetail/EventDetail";
import NotFound from "../pages/notFound/NotFound";
  
export default function Routes() {
  return (
    <Router>
      <Routers>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/eventlisting" element={<EventListing />} />
        <Route path="/eventdetail" element={<EventDetail />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/notfound" element={<NotFound />} />
      </Routers>
    </Router>
  );
};
