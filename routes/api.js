"use strict";

module.exports = function (app, models) {
  const Issue = models.Issue;

  app
    .route("/api/issues/:project")

    // view all project issues
    .get(function (req, res) {
      let project = req.params.project;
      console.log("\nGET /" + project);
      console.log(req.query);
      Issue.findAllInProject(project, req.query, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      });
    })

    // submit new issue
    .post(function (req, res) {
      let project = req.params.project;
      console.log("\nPOST /" + project);
      console.log(req.body);
      Issue.addOne(project, req.body, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      });
    })

    // update issue
    .put(function (req, res) {
      let project = req.params.project;
      console.log("\nPUT /" + project);
      console.log(req.body);
      Issue.updateOne(project, req.body, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      });
    })

    // delete issue
    .delete(function (req, res) {
      let project = req.params.project;
      console.log("\nDELETE /" + project);
      console.log(req.body);
      Issue.removeOne(project, req.body._id, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      });
    });
};
