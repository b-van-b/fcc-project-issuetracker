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
const projectSchema = new Schema({
  name: String,
});

const issueSchema = new Schema({
  issue_title: String,
  issue_text: String,
  created_by: String,
  assigned_to: String,
  status_text: String,
  created_on: Date,
  updated_on: Date,
  open: Boolean,
  project_name: String,
});

// models
const Project = mongoose.model("Project", projectSchema);
const Issue = mongoose.model("Issue", issueSchema);

Issue.addOne = (projectName, params, done) => {
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
  if (!mongoose.Types.ObjectId.isValid(params._id)) {
    return done({ error: "invalid ObjectId" });
  }
  console.log(`Searching for issue ${params._id} in project ${projectName}`);
  // find the issue by id & project name
  Issue.findOne(
    { project_name: projectName, _id: params._id },
    (err, issue) => {
      if (err) return console.log(err);
      if (!issue) return console.log("No issue found!");
      // if found, update any params that are not _id or empty strings
      Object.keys(params).forEach((key) => {
        if (key != "_id" && params[key] !== "") {
          issue[key] = params[key];
        }
      });
      // save issue doc & pass to callback
      issue.save((err, data) => {
        if (err) return console.log(data);
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

// exports
module.exports = { connect, models: { Project, Issue } };
