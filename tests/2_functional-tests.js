const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { faker } = require("@faker-js/faker");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // save dataset that was input for later testing with output
  const testdata = [];
  // generate unique project name based on UTC date & time of testing
  const projectName = new Date().toUTCString().replaceAll(/[ ,:]/g, "-");
  // common endpoint for each request
  const endpoint = "/api/issues/" + projectName;

  // #1
  // Create an issue with every field: POST request to /api/issues/{project}
  test("POST every field to /api/issues/{project}", function (done) {
    const data = {
      issue_title: faker.random.words(),
      issue_text: faker.random.words(5),
      created_by: "Mark",
      assigned_to: faker.name.fullName(),
      status_text: faker.random.words(),
    };
    const targetDate = new Date();
    chai
      .request(server)
      .post(endpoint)
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

        // record for later testing
        testdata.push(output);
        done();
      });
  });
  // #2
  // Create an issue with only required fields: POST request to /api/issues/{project}
  test("POST only required fields to /api/issues/{project}", function (done) {
    const data = {
      issue_title: faker.random.words(),
      issue_text: faker.random.words(5),
      created_by: "John",
    };
    const targetDate = new Date();
    chai
      .request(server)
      .post(endpoint)
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

        // record for later testing
        testdata.push(output);
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
      .post(endpoint)
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
      .get(endpoint)
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        assert.isDefined(output);
        assert.isArray(output);
        assert.deepEqual(output, testdata);
        done();
      });
  });
  // #5
  // View issues on a project with one filter: GET request to /api/issues/{project}
  test("GET project issues from /api/issues/{project} with filter", function (done) {
    chai
      .request(server)
      .get(endpoint + "?created_by=Mark")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        const output = JSON.parse(res.text);
        assert.isDefined(output);
        assert.isArray(output);
        assert.deepEqual(
          output,
          testdata.filter((d) => d.created_by == "Mark")
        );
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
