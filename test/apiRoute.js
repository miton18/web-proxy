let supertest = require("supertest");
let expect = require("expect");

let api = supertest.agent("http://local.dev:8080/api");

describe("API test /route", () => {

  beforeEach(() => {
    
  });

  it("should return list of routes", done => {
    api
    .get("/route")
    .expect("Content-type", /json/)
    .expect(200) // THis is HTTP response
    .end((err, res) => {
      res.status.should.equal(200);
      expect(res.body).be.a('array');
      expect(res.body).to.have.length(1);
      done();
    });
  });
  it('should get one route', () => {});
  it('should add a new route', () => {});
  it('should edit a new route', () => {});
  it('should remove a route', () => {});
});
describe("other tests", () => {});
