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
  entityCode: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\-0-9]+$/.test(v);
      },
      message: "{PATH} can contain only alphabets and numbers"
    }
  },
  name: {
    type: String,
    minLength: 1,
    maxLength: 50,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\-0-9]+$/.test(v);
      },
      message: "{PATH} can contain only alphabets and numbers"
    }
  },
  level: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    minLength: 1,
    maxLength: 255,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\-0-9 ]+$/.test(v);
      },
      message: "{PATH} can contain only alphabets and numbers"
    }
  },
  enable: {
    type: Boolean,
    default: true
  },
  processingStatus: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    required: true
  },
  parent: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z\-0-9]+$/.test(v);
      },
      message: "{PATH} can contain only alphabets and numbers"
    }
  },
  contact: {
    type: Object,
    ref: 'Contact'
  }
});

module.exports = branchSchema;