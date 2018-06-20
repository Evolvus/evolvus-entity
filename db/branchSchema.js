const mongoose = require("mongoose");
const validator = require("validator");
const {
  contact
} = require("evolvus-contact");

var Contact = mongoose.model("contactCollection", contact.contactDBschema);

var branchSchema = new mongoose.Schema({
  // Add all attributes below tenantId
  tenantId: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 64
  },
  code: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true,
    unique: true
  },
  name: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true
  },
  parent: {
    type: Object
  },
  contact: {
    type: Object,
    ref: 'Contact',
    required: true
  }
});

module.exports = branchSchema;