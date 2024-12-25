const mongoose = require("mongoose");

const ticketDetailsSchema = new mongoose.Schema(
  {
    studentName: String,
    applicationNumber: String,
    hostelName: String,
    zone: String,
    stopping: String,
  },
  {
    collection: "Tickets",
  }
);

module.exports = mongoose.model("Ticket", ticketDetailsSchema);
