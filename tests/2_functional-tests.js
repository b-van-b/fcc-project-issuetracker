const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { faker } = require("@faker-js/faker");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  // #1
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
  test("POST missing required fields (all) to /api/issues/{project}", function (done) {
    const data = {
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
        assert.deepEqual(output, { error: "required field(s) missing" });
        done();
      });
  });
});
