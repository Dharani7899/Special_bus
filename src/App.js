import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom"; // Import useNavigate
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import TicketBooking from "./components/TicketBooking";
import AdminDashboard from "./components/AdminDashboard";
import HolidayPage from "./components/Holidaypage" // Ensure the case matches your file name

function App() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const addTicket = (newTicket) => {
    setTickets((prevTickets) => [...prevTickets, newTicket]);
  };

  const updateTicket = (index, updatedTicket) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket, idx) =>
        idx === index ? { ...ticket, ...updatedTicket } : ticket
      )
    );
  };

  const deleteTicket = (index) => {
    setTickets((prevTickets) => prevTickets.filter((_, idx) => idx !== index));
  };

  const openHolidayPage = () => {
    navigate("/holiday"); // Navigate to the Holiday page
  };

  return (
    <div className="app-container">
      <nav className="vertical-nav">
        <Link className="navbar-brand" to={"/sign-in"}>
          Special Bus Booking
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to={"/sign-in"}>
              Login
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/sign-up"}>
              Sign Up
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/ticket-booking"}>
              Ticket Booking
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/admin-dashboard"}>
              Admin Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <button className="nav-link btn" onClick={openHolidayPage}>
              Holiday
            </button>
          </li>
        </ul>
      </nav>

      <div className="content auth-wrapper" style={{ paddingTop: "70px" }}>
        <div className="auth-inner">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/ticket-booking"
              element={<TicketBooking addTicket={addTicket} />}
            />
            <Route
              path="/admin-dashboard"
              element={
                <AdminDashboard
                  tickets={tickets}
                  addTicket={addTicket}
                  updateTicket={updateTicket}
                  deleteTicket={deleteTicket}
                />
              }
            />
            <Route path="/holiday" element={<HolidayPage />} />{" "}
            {/* New route for Holiday Page */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Wrap the App component with Router in a separate file (usually index.js)
const Main = () => (
  <Router>
    <App />
  </Router>
);

export default Main;
