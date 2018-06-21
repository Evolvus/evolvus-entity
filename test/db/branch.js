const debug = require("debug")("evolvus-branch.test.db.branch");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const branch = require("../../db/branch");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/TestbranchCollection";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/branch.js
describe("db branch testing", () => {
  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  let object1 = {
    // add a valid branch object
    "tenantId": "IVL",
    "entityCode": "entity1",
    "name": "entity1",
    "parent": "entityparent1",
    "description": "bc1 description",
    "createdBy": "SYSTEM",
    "createdDate": new Date().toISOString(),
    "processingStatus": "authorized",
    "level": 1
  };
  let object2 = {
    // add a valid branch object
    "tenantId": "IVL",
    "entityCode": "entity2",
    "name": "entity2",
    "parent": "entityparent2",
    "description": "bc1 description",
    "createdBy": "SYSTEM",
    "createdDate": new Date().toISOString(),
    "processingStatus": "authorized",
    "level": 1
  };

  describe("testing branch.save", () => {
    // Testing save
    // 1. Valid branch should be saved.
    // 2. Non branch object should not be saved.
    // 3. Should not save same branch twice.
    beforeEach((done) => {
      branch.deleteAll()
        .then((data) => {
          done();
        });
    });

    it("should save valid branch to database", (done) => {
      let testbranchCollection = {
        // add a valid branch object
        "tenantId": "IVL",
        "entityCode": "entity1",
        "name": "entity1",
        "parent": "entityparent1",
        "description": "entity1 description",
        "createdBy": "SYSTEM",
        "createdDate": new Date().toISOString(),
        "processingStatus": "authorized",
        "level": 1
      };
      let res = branch.save(testbranchCollection);
      expect(res)
        .to.eventually.have.property('entityCode')
        .to.eql('entity1')
        .notify(done);
    });

    it("should fail saving invalid object to database", (done) => {
      // not even a  object

      let invalidObject = {
        // add a invalid branch object
        "tenantId": "IVL",
        "name": 2346456,
        "contact": {
          "tenantId": "tenId",
          "firstName": "Kamala",
          "middleName": "rani",
          "lastName": "p",
          "email": "kamala@gmail.com",
          "emailVerified": true,
          "phoneNo": "264123",
          "mobileNo": "9878586312",
          "mobileVerified": true,
          "faxNumber": "1221",
          "companyName": "Evolvus",
          "Address1": "Bangalore",
          "Address2": "chennai",
          "city": "Bangalore",
          "state": "karnataka",
          "country": "India",
          "zipCode": "6868"
        }
      };
      let res = branch.save(invalidObject);
      expect(res)
        .to.be.eventually.rejectedWith("branchCollection validation failed")
        .notify(done);
    });
  });

  describe("testing branch.findAll by limit", () => {
    let object1 = {
      // add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity1",
      "name": "entity1",
      "parent": "entityparent1",
      "description": "entity1 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    let object2 = {
      // add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity2",
      "name": "entity2",
      "parent": "entityparent2",
      "description": "entity2 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    let object3 = {
      // add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity3",
      "name": "entity3",
      "parent": "entityparent3",
      "description": "entity3 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    let object4 = {
      // add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity4",
      "name": "entity4",
      "parent": "entityparent4",
      "description": "entity4 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    // 1. Delete all records in the table and insert
    //    4 new records.
    // find -should return an array of size equal to value of limit with the
    // roleMenuItemMaps.
    // Caveat - the order of the roleMenuItemMaps fetched is indeterminate

    // delete all records and insert four roleMenuItemMaps
    beforeEach((done) => {
      branch.deleteAll().then(() => {
        branch.save(object1).then((res) => {
          branch.save(object2).then((res) => {
            branch.save(object3).then((res) => {
              branch.save(object4).then((res) => {
                done();
              });
            });
          });
        });
      });
    });

    it("should return limited number of records", (done) => {
      let res = branch.findAll(3);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          expect(docs[0])
            .to.have.property('entityCode')
            .to.eql('entity1');
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should return all records if value of limit parameter is less than 1 i.e, 0 or -1", (done) => {
      let res = branch.findAll(-1);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(4);
          expect(docs[0])
            .to.have.property('entityCode')
            .to.eql('entity1');
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe("testing branch.find without data", () => {
    // delete all records
    // find should return empty array
    beforeEach((done) => {
      branch.deleteAll()
        .then((res) => {
          done();
        });
    });

    it("should return empty array i.e. []", (done) => {
      let res = branch.findAll(2);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(0);
          expect(docs)
            .to.eql([]);
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  describe("testing branch.findById", () => {
    // Delete all records, insert one record , get its id
    // 1. Query by this id and it should return one branch
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    // 5. Query with arbitrary object
    let testObject = {
      //add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity1",
      "name": "entity1",
      "parent": "entityparent",
      "description": "entity1 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    var id;
    beforeEach((done) => {
      branch.deleteAll()
        .then((res) => {
          branch.save(testObject)
            .then((savedObj) => {
              id = savedObj._id;
              done();
            });
        });
    });

    it("should return branch identified by Id ", (done) => {
      let res = branch.findById(id);
      expect(res)
        .to.eventually.have.property('entityCode')
        .to.eql('entity1')
        .notify(done);
    });

    it("should return null as no branch is identified by this Id ", (done) => {
      let badId = new mongoose.mongo.ObjectId();
      let res = branch.findById(badId);
      expect(res)
        .to.eventually.to.eql(null)
        .notify(done);
    });
  });

  describe("testing branch.findOne", () => {
    let object1 = {
      // add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity1",
      "name": "entity1",
      "parent": "entityparent1",
      "description": "entity1 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    let object2 = {
      // add a valid branch object
      "tenantId": "IVL",
      "entityCode": "entity2",
      "name": "entity2",
      "parent": "entityparent2",
      "description": "entity2 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    // Delete all records, insert two record
    // 1. Query by one attribute and it should return one branch
    // 2. Query by an arbitrary attribute value and it should return {}

    // delete all records and insert two branchs
    beforeEach((done) => {
      branch.deleteAll()
        .then((res) => {
          branch.save(object1)
            .then((res) => {
              branch.save(object2)
                .then((savedObj) => {
                  done();
                });
            });
        });
    });

    it("should return object for valid attribute value", (done) => {
      // take one valid attribute and its value
      let attributename = "entityCode";
      let attributeValue = "entity1";
      let res = branch.findOne(attributename, attributeValue);
      expect(res)
        .to.eventually.have.property('entityCode')
        .to.eql('entity1')
        .notify(done);
    });

    it("should return null as no branch is identified by this attribute ", (done) => {
      let res = branch.findOne(`entityCode`, `dfgt`);
      expect(res)
        .to.eventually.to.eql(null)
        .notify(done);
    });
  });

  describe("testing branch.findMany", () => {
    // Delete all records, insert two record
    // 1. Query by one attribute and it should return all branchs having attribute value
    // 2. Query by an arbitrary attribute value and it should return {}
    let branch1 = {
      //add valid object
      "tenantId": "IVL",
      "entityCode": "entity1",
      "name": "entity1",
      "parent": "entityparent1",
      "description": "entity1 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    let branch2 = {
      //add valid object with one attribute value same as "branch1"
      "tenantId": "IVL",
      "entityCode": "entity2",
      "name": "entity2",
      "parent": "entityparent2",
      "description": "entity2 description",
      "createdBy": "SYSTEM",
      "createdDate": new Date().toISOString(),
      "processingStatus": "authorized",
      "level": 1
    };
    // delete all records and insert two branchs
    beforeEach((done) => {
      branch.deleteAll()
        .then((res) => {
          branch.save(branch1)
            .then((res) => {
              branch.save(branch2)
                .then((savedObj) => {
                  done();
                });
            });
        });
    });

    it("should return array of objects for valid attribute value", (done) => {
      // take one valid attribute and its value
      let attributename = "entityCode";
      let attributeValue = "entity1";
      let res = branch.findMany(attributename, attributeValue);
      expect(res).to.eventually.be.a("array");
      //enter proper length according to input attribute
      expect(res).to.eventually.have.length(1);
      done();
    });

    it("should return empty array as no branch is identified by this attribute ", (done) => {
      let res = branch.findMany(`entityCode`, `sfgdfg`);
      expect(res)
        .to.eventually.to.eql([])
        .notify(done);
    });
  });
});