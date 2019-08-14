const sinon = require('sinon');
const expect = require('chai').expect;
// const assert = require('assert');
const {login, register, reset} = require('../../controllers/auth_controller');
const userModel = require('../../model/user_model');
const jwt = require('jsonwebtoken');

const user_factory = require('../../factory/user_factory.json');

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const mockRequest = params => params;

describe('UserController -> login', function () {
  let findUser;
  beforeEach(() => {
    findUser = sinon.stub(userModel, 'findUser');
  });
  afterEach(() => {
    findUser.restore();
  });

  it('should return 401 if nothing is provided', async function () {
    const req = mockRequest({body: {params: null}});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'no email and password', data: {statusCode: -30}});
  });

  it('should return 401 if password is missing from the body', async function () {
    const req = mockRequest({body: {params: {email: 'test'}}});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'email or password missing', data: {statusCode: -10}});
  });

  it('should return 401 if email is missing from the body', async function () {
    const req = mockRequest({body: {params: {password: 'test'}}});
    const res = mockResponse();
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'email or password missing', data: {statusCode: -10}});
  });

  it('should return 401 if provided email and password is not paired', async function () {
    const req = mockRequest({body: {params: {email: 'test', password: 'test'}}});
    const res = mockResponse();
    findUser.resolves(undefined);
    await login(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'no user found', data: {statusCode: -20}});
  });

  it('should return 200 and user data with token should be returned if user is found with provided email and password',
    async function () {
      const req = mockRequest({body: {params: {email: 'test', password: 'test'}}});
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

describe('UserController -> register', function () {
  let findUser;
  let saveUser;
  beforeEach(() => {
    findUser = sinon.stub(userModel, 'findUser');
    saveUser = sinon.stub(userModel, 'saveUser');
  });
  afterEach(() => {
    findUser.restore();
    saveUser.restore();
  });

  it('should return 401 if nothing is provided', async function () {
    const req = mockRequest({body: {user: null}});
    const res = mockResponse();
    await register(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'no user data is provided', data: {statusCode: -30}});
  });

  it('should return 401 if any required property is missing from the body', async function () {
    const req = mockRequest({body: {user: {email: 'test'}}});
    const res = mockResponse();
    await register(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'missing required property', data: {statusCode: -10}});
  });

  it('should return 401 if an error was thrown when finding a user', async function () {
    const expectedUser = user_factory.tom;
    const expectedError = 'Unexpected error';
    const req = mockRequest({body: {user: expectedUser}});
    const res = mockResponse();
    findUser.throws(expectedError);
    await register(req, res);
    // assert.strictEqual(expectedUser, user);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'Error', data: {errorMessage: 'Unexpected error', statusCode: -1}});
  });

  it('should return 401 if user already exists', async function () {
    const expectedUser = user_factory.tom;
    const req = mockRequest({body: {user: expectedUser}});
    const res = mockResponse();
    findUser.resolves(expectedUser);
    await register(req, res);
    sinon.assert.calledTwice(findUser);
    // assert.strictEqual(expectedUser, user);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'user already exists', data: {statusCode: -40}});
  });

  it('should return 200 and the saved user data if this user is unique', async function () {
    const expectedUser = user_factory.tom;
    const req = mockRequest({body: {user: expectedUser}});
    const res = mockResponse();
    saveUser.resolves(expectedUser);
    await register(req, res);
    sinon.assert.calledOnce(saveUser);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {
      message: 'user created', data: {user: expectedUser, statusCode: 1}
    });
  });
});

describe('UserController -> reset', function () {
  let findUser;
  let saveUser;
  let findUserAndUpdate;
  beforeEach(() => {
    findUser = sinon.stub(userModel, 'findUser');
    saveUser = sinon.stub(userModel, 'saveUser');
    findUserAndUpdate = sinon.stub(userModel, 'findUserAndUpdate');
  });
  afterEach(() => {
    findUser.restore();
    saveUser.restore();
    findUserAndUpdate.restore();
  });

  it('should return 401 if nothing is provided', async function () {
    const req = mockRequest({body: {userId: null, password: null}});
    const res = mockResponse();
    await reset(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'no data is provided to reset password', data: {statusCode: -30}});
  });

  it('should return 401 if an error was thrown when finding a user by Id', async function () {
    const expectedUser = user_factory.tom;
    const expectedError = 'Unexpected error';
    const expectedPassword = expectedUser.password + '_updated';
    const req = mockRequest({body: {userId: expectedUser._id, password: expectedPassword}});
    const res = mockResponse();
    findUserAndUpdate.throws(expectedError);
    await reset(req, res);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'Error', data: {errorMessage: 'Unexpected error', statusCode: -1}});
  });

  it('should return 401 if no user is found by given user id', async function () {
    const expectedUser = user_factory.tom;
    const expectedPassword = expectedUser.password + '_updated';
    const req = mockRequest({body: {userId: expectedUser._id, password: expectedPassword}});
    const res = mockResponse();
    findUser.resolves(undefined);
    await reset(req, res);
    sinon.assert.calledOnce(findUser);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'user does not exist with given ID', data: {statusCode: -20}});
  });

  it('should return 401 if an error was thrown when finding or updating a user', async function () {
    const expectedUser = user_factory.tom;
    const expectedError = 'Unexpected error';
    const expectedPassword = expectedUser.password + '_updated';
    const req = mockRequest({body: {userId: expectedUser._id, password: expectedPassword}});
    const res = mockResponse();
    findUser.resolves(expectedUser);
    findUserAndUpdate.throws(expectedError);
    await reset(req, res);
    // assert.strictEqual(expectedUser, user);
    sinon.assert.calledWith(res.status, 401);
    sinon.assert.calledWith(res.json, {message: 'Error', data: {errorMessage: 'Unexpected error', statusCode: -1}});
  });

  it('should return 200 and the saved user data if this user is unique', async function () {
    const expectedUser = user_factory.tom;
    const expectedPassword = expectedUser.password + '_updated';
    const resultUser = user_factory.tom;
    resultUser.password = expectedPassword;
    const req = mockRequest({body: {userId: expectedUser._id, password: expectedPassword}});
    const res = mockResponse();
    findUser.resolves(expectedUser);
    findUserAndUpdate.resolves(resultUser);
    await reset(req, res);
    sinon.assert.calledOnce(findUserAndUpdate);
    sinon.assert.calledWith(res.status, 200);
    sinon.assert.calledWith(res.json, {message: 'password has been reset', data: {user: resultUser, statusCode: 1}});
  });
});
