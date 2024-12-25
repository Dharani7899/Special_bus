// StudentLogin.js
import React, { useState, useEffect } from "react";

const StudentLogin = ({ holidayInfo }) => {
  const [holidayMessage, setHolidayMessage] = useState("");

  // Set up the holiday message to display as a marquee
  useEffect(() => {
    if (holidayInfo) {
      setHolidayMessage(
        `Holiday: ${holidayInfo.name} - From: ${holidayInfo.startDate} To: ${holidayInfo.endDate}`
      );
    }
  }, [holidayInfo]);

  return (
    <div className="student-login-container">
      <h2>Student Login</h2>
      <form>
        <div className="form-group">
          <label>Registration Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Registration Number"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>

      {/* Marquee for holiday display */}
      {holidayMessage && (
        <marquee className="holiday-marquee">{holidayMessage}</marquee>
      )}
    </div>
  );
};

export default StudentLogin;
