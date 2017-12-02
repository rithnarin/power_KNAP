const expect = require('chai').expect;
const db = require('../database/postgres.js');
const server = require('../server/index.js');
const supertest = require('supertest');
const testRequest = supertest.agent(server);


describe('** Node / Express server **', function() {
  describe('The GET / route', function () {
    it('should respond with html', function (done) {
      // just assume that if it contains '<div>' it's html
      testRequest
        .get('/')
        .expect(200, /<div/, done);
    });
  });
});

describe('** Postgres / Sequelize database set-up **', function() {
  describe('...', function () {
    it('should...', function (done) {
      expect(1).to.equal(0);
    });
  });
});

describe('** Postgres / Sequelize database integration **', function() {
  describe('...', function () {
    it('should ...', function (done) {
      expect(1).to.equal(0);
    });
  });
});

describe('** React client **', function() {
  describe('...', function () {
    it('should...', function (done) {
      expect(1).to.equal(0);
    });
  });
});