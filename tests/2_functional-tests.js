const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { faker } = require("@faker-js/faker");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // #1
  // Create an issue with every field: POST request to /api/issues/{project}
  test("POST every field to /api/issues/{project}", function (done) {
    const data = {
      issue_title: faker.random.words(),
      issue_text: faker.random.words(5),
      created_by: faker.name.fullName(),
      assigned_to: faker.name.fullName(),
      status_text: faker.random.words(),
    };
    const targetDate = new Date();
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send(data)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        Object.keys(data).forEach((key) => {
          assert.equal(data[(key, output[key])]);
        });

        assert.isTrue(output.open);
        assert.isDefined(output._id);

        //test dates
        const date = new Date(output.created_on);
        assert.isDefined(output.created_on);
        assert.equal(output.created_on, output.updated_on);
        assert.equal(date.getFullYear(), targetDate.getFullYear());
        assert.equal(date.getMonth(), targetDate.getMonth());
        assert.equal(date.getDate(), targetDate.getDate());
        done();
      });
  });
  // #2
  // Create an issue with only required fields: POST request to /api/issues/{project}
  test("POST only required fields to /api/issues/{project}", function (done) {
    const data = {
      issue_title: faker.random.words(),
      issue_text: faker.random.words(5),
      created_by: faker.name.fullName(),
    };
    const targetDate = new Date();
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send(data)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        Object.keys(data).forEach((key) => {
          assert.equal(data[(key, output[key])]);
        });

        assert.isTrue(output.open);
        assert.isDefined(output._id);

        //test dates
        assert.isDefined(output.created_on);
        assert.equal(output.created_on, output.updated_on);
        const date = new Date(output.created_on);
        assert.equal(date.getFullYear(), targetDate.getFullYear());
        assert.equal(date.getMonth(), targetDate.getMonth());
        assert.equal(date.getDate(), targetDate.getDate());
        done();
      });
  });
  // #3
  // Create an issue with missing required fields: POST request to /api/issues/{project}
  test("POST missing required fields (all) to /api/issues/{project}", function (done) {
    const data = {
      assigned_to: faker.name.fullName(),
      status_text: faker.random.words(),
    };
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send(data)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        assert.deepEqual(output, { error: "required field(s) missing" });
        done();
      });
  });
  // #4
  // View issues on a project: GET request to /api/issues/{project}
  test("GET project issues from /api/issues/{project}", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        assert.isDefined(output);
        assert.isArray(output);
        done();
      });
  });
  // #5
  // View issues on a project with one filter: GET request to /api/issues/{project}
  test("GET project issues from /api/issues/{project} with filter", function (done) {
    chai
      .request(server)
      .get("/api/issues/apitest?open=true")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        assert.isDefined(output);
        assert.isArray(output);
        done();
      });
  });
  // #6
  // View issues on a project with multiple filters: GET request to /api/issues/{project}
  // #7
  // Update one field on an issue: PUT request to /api/issues/{project}
  // #8
  // Update multiple fields on an issue: PUT request to /api/issues/{project}
  // #9
  // Update an issue with missing _id: PUT request to /api/issues/{project}
  // #10
  // Update an issue with no fields to update: PUT request to /api/issues/{project}
  // #11
  // Update an issue with an invalid _id: PUT request to /api/issues/{project}
  // #12
  // Delete an issue: DELETE request to /api/issues/{project}
  // #13
  // Delete an issue with an invalid _id: DELETE request to /api/issues/{project}
  // #14
  // Delete an issue with missing _id: DELETE request to /api/issues/{project}
});
