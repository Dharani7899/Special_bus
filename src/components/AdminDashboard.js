import React, { useState } from "react";
import {
  FaEdit,
  FaSave,
  FaTrash,
  FaTimes,
  FaPlus,
  FaFilePdf,
  FaFileExcel,
} from "react-icons/fa";
import { Dropdown, DropdownButton } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import "./AdminDashboard.css";

const AdminDashboard = ({ tickets, addTicket, updateTicket, deleteTicket }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    studentName: "",
    applicationNumber: "",
    hostelName: "",
    zone: "",
    stage: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedTicket, setEditedTicket] = useState(null);
  const [error, setError] = useState("");
  const [filteredZone, setFilteredZone] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 5; // Number of tickets to display per page
  const uniqueZones = [...new Set(tickets.map((ticket) => ticket.zone))];

  const handleAddStudent = () => {
    if (
      !newTicket.studentName ||
      !newTicket.applicationNumber ||
      !newTicket.hostelName ||
      !newTicket.zone ||
      !newTicket.stage
    ) {
      setError("All fields are required.");
      return;
    }

    // Call the addTicket prop to add the new student
    addTicket(newTicket);

    // Reset the modal and input fields
    setIsModalOpen(false);
    setNewTicket({
      studentName: "",
      applicationNumber: "",
      hostelName: "",
      zone: "",
      stage: "",
    });
    setError("");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedTicket({ ...tickets[index] });
  };

  const handleSave = () => {
    updateTicket(editingIndex, editedTicket);
    setEditingIndex(null);
    setEditedTicket(null);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedTicket(null);
  };

  const filteredTickets = filteredZone
    ? tickets.filter((ticket) => ticket.zone === filteredZone)
    : tickets;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Student Details", 14, 16);

    const totalCount = filteredTickets.length;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Center the total count text
    const totalText = `Total Students: ${totalCount}`;
    const textWidth = doc.getTextWidth(totalText);
    const centerX = (pageWidth - textWidth) / 2;

    doc.text(totalText, centerX, 24);

    autoTable(doc, {
      startY: 30, // Adjust this to add space below the total count
      head: [
        ["S.No", "Student Name", "Application Number", "Hostel", "Zone", "Stage"],
      ],
      body: filteredTickets.map((ticket, index) => [
        index + 1,
        ticket.studentName,
        ticket.applicationNumber,
        ticket.hostelName,
        ticket.zone,
        ticket.stage,
      ]),
    });

    doc.save("students.pdf");
  };

  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  // Pagination logic
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const displayedTickets = filteredTickets.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="admin-dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      {/* Filter by Zone Dropdown and Buttons */}
      <div className="button-group">
        <DropdownButton
          id="dropdown-basic-button"
          title="Filter by Zone"
          variant="outline-secondary"
        >
          <Dropdown.Item onClick={() => setFilteredZone("")}>
            All Zones
          </Dropdown.Item>
          {uniqueZones.map((zone, index) => (
            <Dropdown.Item key={index} onClick={() => setFilteredZone(zone)}>
              {zone}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        {/* Holiday Button */}
        <button
          className="btn btn-info"
          onClick={() => alert("Holiday button clicked!")}
        >
          Holiday
        </button>

        {/* PDF and Excel Buttons */}
        <button className="btn btn-danger" onClick={generatePDF}>
          <FaFilePdf /> PDF
        </button>
        <button className="btn btn-success" onClick={generateExcel}>
          <FaFileExcel /> Excel
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Student</h5>
              </div>
              <div className="modal-body">
                <form>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="form-group">
                    <label>Student Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter student name"
                      value={newTicket.studentName}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          studentName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Application Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter application number"
                      value={newTicket.applicationNumber}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          applicationNumber: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Hostel</label>
                    <select
                      className="form-control"
                      value={newTicket.hostelName}
                      onChange={(e) =>
                        setNewTicket({
                          ...newTicket,
                          hostelName: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select Hostel
                      </option>
                      <option value="Siruvani">Siruvani</option>
                      <option value="Bhavani">Bhavani</option>
                      <option value="Amaravathi">Amaravathi</option>
                      {/* Add more hostels here as needed */}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Zone</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter zone"
                      value={newTicket.zone}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, zone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stage</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter stage"
                      value={newTicket.stage}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, stage: e.target.value })
                      }
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleAddStudent}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Table */}
      <div className="table-container">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Student Name</th>
              <th>Application Number</th>
              <th>Hostel</th>
              <th>Zone</th>
              <th>Stage</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTickets.map((ticket, index) => (
              <tr key={index}>
                <td>{index + 1 + currentPage * itemsPerPage}</td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTicket.studentName}
                      onChange={(e) =>
                        setEditedTicket({
                          ...editedTicket,
                          studentName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    ticket.studentName
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTicket.applicationNumber}
                      onChange={(e) =>
                        setEditedTicket({
                          ...editedTicket,
                          applicationNumber: e.target.value,
                        })
                      }
                    />
                  ) : (
                    ticket.applicationNumber
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTicket.hostelName}
                      onChange={(e) =>
                        setEditedTicket({
                          ...editedTicket,
                          hostelName: e.target.value,
                        })
                      }
                    />
                  ) : (
                    ticket.hostelName
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTicket.zone}
                      onChange={(e) =>
                        setEditedTicket({
                          ...editedTicket,
                          zone: e.target.value,
                        })
                      }
                    />
                  ) : (
                    ticket.zone
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTicket.stage}
                      onChange={(e) =>
                        setEditedTicket({
                          ...editedTicket,
                          stage: e.target.value,
                        })
                      }
                    />
                  ) : (
                    ticket.stage
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <>
                      <button className="btn btn-success" onClick={handleSave}>
                        <FaSave />
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(index)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteTicket(index)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <h5 className="total-students">
            Total Students: {filteredTickets.length}
          </h5>
        </table>
        {filteredTickets.length > itemsPerPage && (
          <ReactPaginate
            previousLabel={"< Previous"}
            nextLabel={"Next >"}
            breakLabel={"..."}
            pageCount={Math.ceil(filteredTickets.length / itemsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;