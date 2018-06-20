const debug = require("debug")("evolvus-branch.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/TestbranchCollection";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const branch = require("../index");
const db = require("../db/branch");

describe('branch model validation', () => {
  let branchObject = {
    // add a valid branch Object here
    "tenantId": "IVL",
    "code": "bc1",
    "name": "branch1",
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

  let invalidObject = {
    //add invalid branch Object here
    "tenantId": "IVL",
    "code": 4575678,
    "name": "branch1",
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

  let undefinedObject; // object that is not defined
  let nullObject = null; // object that is null

  // before we start the tests, connect to the database
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("validation against jsonschema", () => {
    it("valid branch should validate successfully", (done) => {
      try {
        var res = branch.validate(branchObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid branch object should not throw exception: ${e}`);
      }
    });

    it("invalid branch should return errors", (done) => {
      try {
        var res = branch.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = branch.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = branch.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });

  describe("testing branch.save method", () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should save a valid branch object to database', (done) => {
      try {
        var result = branch.save(branchObject);
        //replace anyAttribute with one of the valid attribute of a branch Object
        expect(result)
          .to.eventually.have.property("code")
          .to.eql(branchObject.code)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving branch object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid branch object to database', (done) => {
      try {
        var result = branch.save(invalidObject);
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing branch.getAll when there is data in database', () => {
    let object1 = {
        //add one valid branch object here
        "tenantId": "IVL",
        "code": "bc1",
        "name": "branch1",
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
      },
      object2 = {
        //add one more valid branch object here
        "tenantId": "IVL",
        "code": "bc2",
        "name": "branch2",
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
    let object3 = {
      "tenantId": "IVL",
      "code": "bc3",
      "name": "branch3",
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
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            db.save(object3).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return limited records as specified by the limit parameter', (done) => {
      try {
        let res = branch.getAll(2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(2);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return all records if limit is -1', (done) => {
      try {
        let res = branch.getAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(3);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw IllegalArgumentException for null value of limit', (done) => {
      try {
        let res = branch.getAll(null);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw IllegalArgumentException for undefined value of limit', (done) => {
      try {
        let undefinedLimit;
        let res = branch.getAll(undefinedLimit);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing branch.getAll when there is no data', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should return empty array when limit is -1', (done) => {
      try {
        let res = branch.getAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty array when limit is positive value ', (done) => {
      try {
        let res = branch.getAll(2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  describe('testing getById', () => {
    let branchObject = {
      "tenantId": "IVL",
      "code": "bc1",
      "name": "branch1",
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
    // Insert one record , get its id
    // 1. Query by this id and it should return one branch object
    // 2. Query by an arbitrary id and it should return {}
    // 3. Query with null id and it should throw IllegalArgumentException
    // 4. Query with undefined and it should throw IllegalArgumentException
    var id;
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(branchObject).then((res) => {
          id = res._id;
          done();
        });
      });
    });

    it('should return one branch matching parameter id', (done) => {
      try {
        var res = branch.getById(id);
        expect(res).to.eventually.have.property('_id')
          .to.eql(id)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty object i.e. {} as no branch is identified by this Id ', (done) => {
      try {
        let badId = new mongoose.mongo.ObjectId();
        var res = branch.getById(badId);
        expect(res).to.eventually.to.eql({})
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
      try {
        let undefinedId;
        let res = branch.getById(undefinedId);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null Id parameter ", (done) => {
      try {
        let res = branch.getById(null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should be rejected for arbitrary object as Id parameter ", (done) => {
      // an id is a 12 byte string, -1 is an invalid id value
      let id = branchObject;
      let res = branch.getById(id);
      expect(res)
        .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
        .notify(done);
    });

  });

  describe("testing branch.getOne", () => {
    let object1 = {
        //add one valid branch object here
        "tenantId": "IVL",
        "code": "bc1",
        "name": "branch1",
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
      },
      object2 = {
        //add one more valid branch object here
        "tenantId": "IVL",
        "code": "bc2",
        "name": "branch2",
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
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it("should return one branch record identified by attribute", (done) => {
      try {
        // take one attribute from object1 or object2 and its value
        let res = branch.getOne(`code`, `bc1`);
        expect(res)
          .to.eventually.be.a("object")
          .to.have.property('code')
          .to.eql('bc1')
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty object i.e. {} as no branch is identified by this attribute', (done) => {
      try {
        // replace validAttribute and add a bad value to it
        var res = branch.getOne(`code`, `1dfhty`);
        expect(res).to.eventually.to.eql({})
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        //replace validvalue with a valid value for an attribute
        let undefinedAttribute;
        let res = branch.getOne(undefinedAttribute, `bc1`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        // replace validAttribute with a valid attribute name
        let undefinedValue;
        let res = branch.getOne(`code`, undefinedValue);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
      try {
        //replace validValue with a valid value for an attribute
        let res = branch.getOne(null, `bc1`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null value parameter ", (done) => {
      try {
        //replace attributeValue with a valid attribute name
        let res = branch.getOne(`code`, null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });


  describe("testing branch.getMany", () => {
    let object1 = {
        //add one valid branch object here
        "tenantId": "IVL",
        "code": "bc1",
        "name": "branch1",
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
      },
      object2 = {
        //add one more valid branch object here
        "tenantId": "IVL",
        "code": "bc2",
        "name": "branch2",
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
    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            done();
          });
        });
      });
    });

    it("should return array of branch records identified by attribute", (done) => {
      try {
        // take one attribute from object1 or object2 and its value
        let res = branch.getMany(`code`, `bc1`);
        expect(res).to.eventually.be.a("array");
        //enter proper length according to input value
        expect(res).to.eventually.have.length(1);
        done();
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty array i.e. [] as no branch is identified by this attribute', (done) => {
      try {
        // replace validAttribute and add a bad value to it
        var res = branch.getMany(`code`, `dfgy`);
        expect(res).to.eventually.to.eql([])
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        //replace validvalue with a valid value for an attribute
        let undefinedAttribute;
        let res = branch.getMany(undefinedAttribute, `bc1`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
      try {
        // replace validAttribute with a valid attribute name
        let undefinedValue;
        let res = branch.getMany(`code`, undefinedValue);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
      try {
        //replace validValue with a valid value for an attribute
        let res = branch.getMany(null, `bc1`);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it("should throw IllegalArgumentException for null value parameter ", (done) => {
      try {
        //replace attributeValue with a valid attribute name
        let res = branch.getMany(`code`, null);
        expect(res)
          .to.eventually.to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });
});