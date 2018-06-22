/*
 ** JSON Schema representation of the branch model
 */
module.exports.schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "branchModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64
    },
    "entityCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "level": {
      "type": "number"
    },
    "description": {
      "type": "string",
      "minLength": 1,
      "maxLength": 255
    },
    "enable": {
      "type": "boolean",
      "default": "true"
    },
    "processingStatus": {
      "type": "string"
    },
    "createdBy": {
      "type": "string"
    },
    "createdDate": {
      "type": "string",
      "format": "date-time"
    },
    "parent": {
      "type": "string"
    },
    "contact": {
      "type": "object",
      "properties": {
        "tenantId": {
          "type": "string",
          "minLength": 1,
          "maxLength": 64
        },
        "firstName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "middleName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "lastName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 50
        },
        "email": {
          "type": "string",
          "minLength": 8,
          "maxLength": 50
        },
        "emailVerified": {
          "type": "boolean"
        },
        "phoneNo": {
          "type": "string",
          "minLength": 5,
          "maxLength": 15
        },
        "mobileNo": {
          "type": "string",
          "minLength": 5,
          "maxLength": 15
        },
        "mobileVerified": {
          "type": "boolean"
        },
        "faxNumber": {
          "type": "string",
          "minLength": 1,
          "maxLength": 15
        },
        "companyName": {
          "type": "string",
          "minLength": 1,
          "maxLength": 64
        },
        "Address1": {
          "type": "string"
        },
        "Address2": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "zipCode": {
          "type": "string"
        }
      }
    }
  },
  "required": ["tenantId", "entityCode", "name", "parent", "description", "createdBy", "createdDate", "processingStatus", "level"]
};