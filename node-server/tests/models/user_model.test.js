const expect = require('chai').expect;
const sinon = require('sinon');
require('sinon-mongoose');
const user_model = require('../../factory/user_factory.json');
const {findUser, findUserAndUpdate, saveUser, User} = require('../../model/user_model');

let UserMock;
let UserProtoMock;

const mockInit = function () {
  UserMock = sinon.mock(User);
  UserProtoMock = sinon.mock(User.prototype);
};

const mockRestore = function () {
  UserMock.restore();
  UserProtoMock.restore();
};

describe('UserModel -> find user', function () {

  beforeEach(mockInit);
  afterEach(mockRestore);

  it('should throw an error when no query is passed', function () {
    expect(() => findUser()).to.throw(ReferenceError, 'no query specified');
  });

  it('should throw an error when the query is not an object', function () {
    expect(() => findUser('a string')).to.throw(TypeError, 'not a query object');
  });

  it('should throw an error when the query is empty', function () {
    expect(() => findUser({})).to.throw('query is empty');
  });

  // because email is the unique key in the User Schema defined. When an email matches, it means a user is defined
  // no other property can be proven this user is found
  it('should find a user when an email is found', async function () {
    const expectedUser = user_model.tom,
      expectedEmail = user_model.tom.email;
    UserMock.expects('findOne').withArgs({email: expectedEmail}).chain('exec').yields(null, expectedUser);
    const user = await findUser({email: expectedEmail});
    user.should.be.a('object');
    user.should.have.property('email', expectedEmail);
  });

  it('should not find a user when an email is not found', async function () {
    const notExistingEmail = 'not an email';
    UserMock.expects('findOne').withArgs({email: notExistingEmail}).chain('exec').yields(null, undefined);
    const user = await findUser({email: notExistingEmail});
    expect(user).to.be.a('undefined')
  });

  it('should throw an error when an error occurs executing find operation', function () {
    const notExistingEmail = 'not an email';
    UserMock.expects('findOne').withArgs({email: notExistingEmail}).chain('exec').yields(new Error('something happens'));
    try {
      expect(findUser({email: notExistingEmail})).rejects.to.throw();
    } catch (e) {
      // console.log(e);
      expect(e).to.be.an.instanceOf(Error).with.property('message', 'error find user: Error: something happens');
    }
  });

});

describe('UserModel -> save user', function () {

  beforeEach(mockInit);
  afterEach(mockRestore);

  it('should throw a type arrow when no user passed', function () {
    expect(() => saveUser()).to.throw(TypeError, 'user is not defined');
  });

  it('should throw an error when a required field of Schema is not present', function () {
    // fields missing
    const user = {
      name: 'test user',
      email: 'testuser@test.nl'
    };
    UserProtoMock.expects('save').yields(new Error('required fields are missing from user'));
    try {
      saveUser(user);
      expect(saveUser(user)).to.throw();
    } catch (e) {
      // expect(e).to.be.an.instanceOf(Error).with.property('message', 'error find user: Error: something happens');
    }
  });

});


