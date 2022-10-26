"use strict";

module.exports = function (app, models) {
  const Person = models.Person,
    Issue = models.Issue;

  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;
      console.log("\nGET /" + project);
      console.log(req.body);
    })

    .post(function (req, res) {
      let project = req.params.project;
      console.log("\nPOST /" + project);
      console.log(req.body);
      Issue.addOne(project, req.body, (err, data) => {
        if (err) return console.log(err);
        res.json(data);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;
      console.log("\nPUT /" + project);
      console.log(req.body);
    })

    .delete(function (req, res) {
      let project = req.params.project;
      console.log("\nDELETE /" + project);
      console.log(req.body);
    });
};
