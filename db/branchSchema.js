const mongoose = require("mongoose");
const validator = require("validator");
var contactSchema = require('evolvus-contact').contactSchema;

contactSchema = { contactSchema };
var branchSchema = new mongoose.Schema({
    // Add all attributes below tenantId
    tenantId: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 64
    },
    contact: contactSchema

});

module.exports = branchSchema;