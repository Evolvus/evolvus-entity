const debug = require("debug")("evolvus-branch:index");
const branchSchema = require("./model/branchSchema")
  .schema;
const branchCollection = require("./db/branch");
const validate = require("jsonschema")
  .validate;
const docketClient = require("evolvus-docket-client");

var branchDBschema = require("./db/branchSchema");

var docketObject = {
  // required fields
  application: "PLATFORM",
  source: "branch",
  name: "",
  createdBy: "",
  ipAddress: "",
  status: "SUCCESS", //by default
  eventDateTime: Date.now(),
  keyDataAsJSON: "",
  details: "",
  //non required fields
  level: ""
};

module.exports.branch = {
  branchDBschema,
  branchSchema
};

module.exports.validate = (branchObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof branchObject === "undefined") {
        throw new Error("IllegalArgumentException:branchObject is undefined");
      }
      var res = validate(branchObject, branchSchema);
      debug("validation status: ", JSON.stringify(res));
      if (res.valid) {
        resolve(res.valid);
      } else {
        reject(res.errors);
      }
    } catch (err) {
      reject(err);
    }
  });
};

// All validations must be performed before we save the object here
// Once the db layer is called its is assumed the object is valid.
module.exports.save = (branchObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof branchObject === 'undefined' || branchObject == null) {
        throw new Error("IllegalArgumentException: branchObject is null or undefined");
      }
      docketObject.name = "branch_save";
      docketObject.keyDataAsJSON = JSON.stringify(branchObject);
      docketObject.details = `branch creation initiated`;
      docketClient.postToDocket(docketObject);
      var res = validate(branchObject, branchSchema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      } else {
        // if the object is valid, save the object to the database
        branchCollection.save(branchObject).then((result) => {
          debug(`saved successfully ${result}`);
          resolve(result);
        }).catch((e) => {
          debug(`failed to save with an error: ${e}`);
          reject(e);
        });
      }
      // Other validations here
    } catch (e) {
      docketObject.name = "branch_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(branchObject);
      docketObject.details = `caught Exception on branch_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

// List all the objects in the database
// makes sense to return on a limited number
// (what if there are 1000000 records in the collection)
module.exports.getAll = (limit) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof(limit) == "undefined" || limit == null) {
        throw new Error("IllegalArgumentException: limit is null or undefined");
      }
      docketObject.name = "branch_getAll";
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `branch getAll method`;
      docketClient.postToDocket(docketObject);

      branchCollection.findAll(limit).then((docs) => {
        debug(`branch(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the branch(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "branch_ExceptionOngetAll";
      docketObject.keyDataAsJSON = "branchObject";
      docketObject.details = `caught Exception on branch_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};


// Get the entity idenfied by the id parameter
module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    try {

      if (typeof(id) == "undefined" || id == null) {
        throw new Error("IllegalArgumentException: id is null or undefined");
      }
      docketObject.name = "branch_getById";
      docketObject.keyDataAsJSON = `branchObject id is ${id}`;
      docketObject.details = `branch getById initiated`;
      docketClient.postToDocket(docketObject);

      branchCollection.findById(id)
        .then((res) => {
          if (res) {
            debug(`branch found by id ${id} is ${res}`);
            resolve(res);
          } else {
            // return empty object in place of null
            debug(`no branch found by this id ${id}`);
            resolve({});
          }
        }).catch((e) => {
          debug(`failed to find branch ${e}`);
          reject(e);
        });

    } catch (e) {
      docketObject.name = "branch_ExceptionOngetById";
      docketObject.keyDataAsJSON = `branchObject id is ${id}`;
      docketObject.details = `caught Exception on branch_getById ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "branch_getOne";
      docketObject.keyDataAsJSON = `branchObject ${attribute} with value ${value}`;
      docketObject.details = `branch getOne initiated`;
      docketClient.postToDocket(docketObject);
      branchCollection.findOne(attribute, value).then((data) => {
        if (data) {
          debug(`branch found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no branch found by this ${attribute} ${value}`);
          resolve({});
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "branch_ExceptionOngetOne";
      docketObject.keyDataAsJSON = `branchObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on branch_getOne ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getMany = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "branch_getMany";
      docketObject.keyDataAsJSON = `branchObject ${attribute} with value ${value}`;
      docketObject.details = `branch getMany initiated`;
      docketClient.postToDocket(docketObject);
      branchCollection.findMany(attribute, value).then((data) => {
        if (data) {
          debug(`branch found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no branch found by this ${attribute} ${value}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "branch_ExceptionOngetMany";
      docketObject.keyDataAsJSON = `branchObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on branch_getMany ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.filterByBranchDetails = (filterQuery) => {
  return new Promise((resolve, reject) => {
    try {
      if (filterQuery == null) {
        throw new Error(`IllegalArgumentException: filterQuery is ${filterQuery}`);
      }
      docketObject.name = "entity_filterByBranchDetails";
      docketObject.keyDataAsJSON = `Filter the entity collection by query ${filterQuery}`;
      docketObject.details = `entity_filterByBranchDetails initiated`;
      docketClient.postToDocket(docketObject);
      branchCollection.filterByBranchDetails(filterQuery).then((filteredData) => {
        if (filteredData.length > 0) {
          debug(`filtered Data is ${filteredData}`);
          resolve(filteredData);
        } else {
          debug(`No data available for filter query ${filterQuery}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "entity_ExceptionOnFilterByBranchDetails";
      docketObject.keyDataAsJSON = `Filter the entity collection by query ${filterQuery}`;
      docketObject.details = `caught Exception on entity_filterByBranchDetails ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};