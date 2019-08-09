const sinon = require('sinon');
const expect = require('chai').expect;
const { login } = require('../../controllers/auth_controller');
const userModel = require('../../model/user_model');
const jwt = require('jsonwebtoken');

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const mockRequest = params => ({body: {params: params}});

describe('UserController -> login', function () {
  let findUser;
  let sign;
  beforeEach(() => {
    findUser = sinon.stub(userModel, 'findUser');
    // sign = sinon.stub(jwt, 'sign');
  });
  afterEach(() => {
    findUser.restore();
    // sign.restore();
  });
  it('should return 401 if email is missing from the body', async function () {
    const req = mockRequest({email: 'test'});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'email or password missing', statusCode: -10});
  });
  it('should return 401 if password is missing from the body', async function () {
    const req = mockRequest({password: 'test'});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'email or password missing', statusCode: -10});
  });
  it('should return 200 if user is found with provided email and password', async function () {
    const req = mockRequest({email: 'test', password: 'test'});
    const res = mockResponse();
    findUser.resolves({name: 'test'});
    await login(req, res);
    // const token = sign.returns('jwt token');
    sinon.assert.calledOnce(findUser);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      message: 'user found', data: {
       user: {name: 'test'}, statusCode: 1
      }
    });
  });
});


