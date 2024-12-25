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
    collection: "Tickets", // Name of the collection in MongoDB
  }
);

module.exports = mongoose.model("Ticket", ticketDetailsSchema);
