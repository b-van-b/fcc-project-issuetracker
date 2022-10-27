require("dotenv").config();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const connect = () => {
  console.log("Attempting to connect to database...");
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        resolve("Connected to database!");
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// schemas
const issueSchema = new Schema({
  issue_title: {
    type: String,
    required: true,
  },
  issue_text: {
    type: String,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean,
  project_name: String,
});

// models
const Issue = mongoose.model("Issue", issueSchema);

Issue.addOne = (projectName, params, done) => {
  // check for missing required fields
  if (!(params.issue_title && params.issue_text && params.created_by)) {
    return done(null, { error: "required field(s) missing" });
  }
  // create new issue
  const issue = new Issue({
    issue_title: params.issue_title,
    issue_text: params.issue_text,
    created_by: params.created_by,
    assigned_to: params.assigned_to || "",
    status_text: params.status_text || "",
    created_on: new Date(),
    open: true,
    project_name: projectName,
  });
  issue.updated_on = new Date(issue.created_on);
  // save it
  issue.save((err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

Issue.updateOne = (projectName, params, done) => {
  // reject missing _id
  if (!params._id) {
    return done(null, { error: "missing _id" });
  }
  // reject invalid _id
  if (!mongoose.Types.ObjectId.isValid(params._id)) {
    return done(null, { error: "could not update", _id: params._id });
  }
  console.log(`Searching for issue ${params._id} in project ${projectName}`);
  let updated = false;
  // find the issue by id & project name
  Issue.findOne(
    { project_name: projectName, _id: params._id },
    (err, issue) => {
      if (err) return console.log(err);
      if (!issue) return console.log("No issue found!");
      // if found, update any params that are not _id or empty strings
      Object.keys(params).forEach((key) => {
        if (key != "_id" && params[key] !== "") {
          updated = true;
          issue[key] = params[key];
        }
      });
      // set updated_on
      if (updated) issue.updated_on = new Date();
      // save issue doc & pass to callback
      issue.save((err, data) => {
        // send data to user indicating update failed
        if (err) {
          console.log(err);
          return done(null, { error: "could not update", _id: params._id });
        }
        done(null, data);
      });
    }
  );
};

Issue.removeOne = (projectName, _id, done) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return done({ error: "invalid ObjectId" });
  }
  console.log(`Deleting issue ${_id} in project ${projectName}`);
  Issue.deleteOne({ project_name: projectName, _id: _id }, (err, data) => {
    if (err) return console.log(err);
    const report = {
      _id: _id,
    };
    if (data.acknowledged && data.deletedCount) {
      report.result = "successfully deleted";
    } else {
      report.error = "could not delete";
    }
    done(null, report);
  });
};

Issue.findAllInProject = (projectName, filter, done) => {
  console.log("Finding all issues in project " + projectName);
  const searchQuery = Object.assign({ project_name: projectName }, filter);
  console.log("Filter: " + JSON.stringify(searchQuery));

  Issue.find(searchQuery, (err, data) => {
    if (err) return console.log(err);
    done(null, data);
  });
};

// exports
module.exports = { connect, models: { Issue } };
