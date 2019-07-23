const expect = require('chai').expect;
const sinon = require('sinon');
const user_model = require('../factory/user_factory.json');

const authRegister = require('../controllers/auth_controller').register;
const User = require('../model').User;

describe('auth route', function () {
  beforeEach(function () {
    sinon.stub(User.prototype, 'save');
  });
  afterEach(function () {
    User.find.restore();
  });

  it('should save this user', function () {
    const saveUser = user_model.tom;
    User.prototype.save.yields(null, saveUser);
    const req = {body: {user: saveUser}};
    const res = {
      send: sinon.stub({})
    };
    authRegister(req, res);
    sinon.assert.calledWith(res.send, saveUser);
  })
});

