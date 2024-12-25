import React, { useState } from "react";
import "./TicketBooking.css";
import { Form, Button, Alert, Dropdown, DropdownButton } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import collegeLogo from "./img.png"; // Import your college logo

const districts = [
  "Ariyalur",
  "Chengalpattu",
  "Chennai",
  "Coimbatore",
  "Cuddalore",
  "Dharmapuri",
  "Dindigul",
  "Erode",
  "Kanchipuram",
  "Kanyakumari",
  "Karur",
  "Krishnagiri",
  "Madurai",
  "Nagapattinam",
  "Namakkal",
  "Perambalur",
  "Pudukkottai",
  "Ramanathapuram",
  "Salem",
  "Sivagangai",
  "Thanjavur",
  "Theni",
  "Tiruchirappalli",
  "Tirunelveli",
  "Tiruppur",
  "Tiruvallur",
  "Tiruvannamalai",
  "Vellore",
  "Viluppuram",
  "Virudhunagar",
];

const TicketBooking = ({ addTicket }) => {
  const [studentName, setStudentName] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const [hostelName, setHostelName] = useState("Siruvani");
  const [zone, setZone] = useState("");
  const [stage, setStage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [ticketDetails, setTicketDetails] = useState(null); // New state for ticket details

  const handleHostelSelect = (hostel) => {
    setHostelName(hostel);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!studentName || !applicationNumber || !zone || !stage) {
      setErrorMessage("All fields are required.");
      return;
    }

    const newTicket = {
      studentName,
      applicationNumber,
      hostelName,
      zone,
      stage,
    };

    addTicket(newTicket);
    setIsBooked(true);
    setTicketDetails(newTicket); // Store the ticket details

    // Reset fields after booking
    setStudentName("");
    setApplicationNumber("");
    setHostelName("Siruvani");
    setZone("");
    setStage("");
  };

  const generateBill = () => {
    if (!ticketDetails) return; // Ensure there are ticket details to generate the bill

    const doc = new jsPDF();

    // Set background color
    doc.setFillColor(255, 255, 204); // Mild yellow color
    doc.rect(
      0,
      0,
      doc.internal.pageSize.getWidth(),
      doc.internal.pageSize.getHeight(),
      "F"
    );

    // Add college logo
    doc.addImage(collegeLogo, "PNG", 10, 10, 40, 40); // Adjust size as needed

    // Add college name
    doc.setFontSize(16); // Reduced font size
    doc.text("Vivekanandha College of Engineering for Women", 70, 20);

    // Add table for student details
    autoTable(doc, {
      head: [["Field", "Value"]],
      body: [
        ["Student Name", ticketDetails.studentName],
        ["Application Number", ticketDetails.applicationNumber],
        ["Hostel", ticketDetails.hostelName],
        ["Zone", ticketDetails.zone],
        ["Stage", ticketDetails.stage],
      ],
      startY: 60, // Adjusted to give space for the logo and title
      theme: "grid",
      styles: {
        cellPadding: 5, // Increased padding
        fontSize: 14, // Increased font size
        lineColor: [0, 0, 0], // Darker table border
        fillColor: [255, 255, 204], // Mild yellow background color
      },
      headStyles: {
        fillColor: [255, 204, 0], // Header background color
        textColor: [0, 0, 0],
        fontSize: 14, // Header text size
      },
    });

    doc.save("ticket-bill.pdf");
  };

  return (
    <div className="ticket-booking-container">
      <h1>Ticket Booking</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formStudentName" className="row">
          <div className="col-12">
            <Form.Label>Student Name:</Form.Label>
            <Form.Control
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
              placeholder="Enter your name"
            />
          </div>
        </Form.Group>

        <Form.Group controlId="formApplicationNumber" className="row">
          <div className="col-12">
            <Form.Label>Application Number:</Form.Label>
            <Form.Control
              type="text"
              value={applicationNumber}
              onChange={(e) => setApplicationNumber(e.target.value)}
              required
              placeholder="Enter your application number"
            />
          </div>
        </Form.Group>

        <Form.Group controlId="formHostel" className="row">
          <div className="col-12">
            <Form.Label>Hostel:</Form.Label>
            <DropdownButton
              id="dropdown-basic-button"
              title={hostelName}
              onSelect={handleHostelSelect}
              variant="primary"
              className="w-100"
            >
              <Dropdown.Item eventKey="Siruvani">Siruvani</Dropdown.Item>
              <Dropdown.Item eventKey="Amaravathi">Amaravathi</Dropdown.Item>
              <Dropdown.Item eventKey="Bavani">Bavani</Dropdown.Item>
            </DropdownButton>
          </div>
        </Form.Group>

        <Form.Group controlId="formZone" className="row">
          <div className="col-12">
            <Form.Label>Zone:</Form.Label>
            <DropdownButton
              id="dropdown-zone-button"
              title={zone || "Select Zone"}
              variant="primary"
              className="w-100"
              onSelect={(selectedZone) => setZone(selectedZone)}
            >
              {districts.map((district, index) => (
                <Dropdown.Item key={index} eventKey={district}>
                  {district}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </Form.Group>

        <Form.Group controlId="formStage" className="row">
          <div className="col-12">
            <Form.Label className="mt-3">Stage:</Form.Label>
            <Form.Control
              type="text"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              required
              placeholder="Enter your stage"
            />
          </div>
        </Form.Group>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Button variant="primary" type="submit" className="mt-3">
          Book Now
        </Button>
      </Form>

      {isBooked && (
        <div>
          <Alert variant="success" className="mt-3">
            Ticket booked successfully!
          </Alert>
          <Button variant="success" onClick={generateBill} className="mt-2">
            Generate Slip
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketBooking;
