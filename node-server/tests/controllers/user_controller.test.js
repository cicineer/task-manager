const sinon = require('sinon');
const expect = require('chai').expect;
const {login} = require('../../controllers/auth_controller');
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
  beforeEach(() => {
    findUser = sinon.stub(userModel, 'findUser');
  });
  afterEach(() => {
    findUser.restore();
  });

  it('should return 401 if nothing is provided', async function () {
    const req = mockRequest(null);
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'no email and password', data: {statusCode: -30}});
  });

  it('should return 401 if email is missing from the body', async function () {
    const req = mockRequest({email: 'test'});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'email or password missing', data: {statusCode: -10}});
  });

  it('should return 401 if password is missing from the body', async function () {
    const req = mockRequest({password: 'test'});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'email or password missing', data: {statusCode: -10}});
  });

  it('should return 401 if provided email and password is not paired', async function () {
    const req = mockRequest({email: 'test', password: 'test'});
    const res = mockResponse();
    findUser.resolves(undefined);
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'no user found', data: {statusCode: -20}});
  });

  it('should return 200 and user data with token should be returned if user is found with provided email and password',
    async function () {
      const req = mockRequest({email: 'test', password: 'test'});
      const res = mockResponse();
      const resolvedUser = {name: 'test'};
      findUser.resolves(resolvedUser);
      await login(req, res);
      const token = jwt.sign({username: resolvedUser.name}, 'angular_taskmgr_jwttoken', {expiresIn: 60 * 60 * 72});
      sinon.assert.calledOnce(findUser);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, {
        message: 'user found', data: {
          token: token, user: resolvedUser, statusCode: 1
        }
      });
    });
});


