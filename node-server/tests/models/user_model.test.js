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
    UserMock.verify();
    expect(user).to.be.a('object');
    expect(user).to.have.property('email', expectedEmail);
  });

  it('should not find a user when an email is not found', async function () {
    const notExistingEmail = 'not an email';
    UserMock.expects('findOne').withArgs({email: notExistingEmail}).chain('exec').yields(null, undefined);
    const user = await findUser({email: notExistingEmail});
    UserMock.verify();
    expect(user).to.be.a('undefined')
  });

  it('should throw an error when an error occurs executing find operation', function () {
    const notExistingEmail = 'not an email';
    UserMock.expects('findOne').withArgs({email: notExistingEmail}).chain('exec').yields(new Error('something happens'));
    try {
      expect(findUser({email: notExistingEmail})).rejects.to.throw();
      UserMock.verify();
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
    // define the errors when executing save method on Model's prototype.
    // This error will be received by method saveUser's error callback method.
    UserProtoMock.expects('save').yields(new Error('ValidationError'));
    try {
      // saveUser will throw an error here.
      saveUser(user);
      // verify if saveUser has thrown an error as expected
      expect(saveUser(user)).to.throw();
      // verify if saveUser has used the the save method on Model's prototype
      UserProtoMock.verify();
    } catch (e) {
      // verify the error type and value. The 'Error: ValidationError' here is defined above
      expect(e).to.be.an.instanceOf(Error).with.property('message', 'user not created: ' + 'Error: ValidationError');
    }
  });

  it('should save a user when all user required information are present and correct', async function () {
    const dob = new Date();
    const user = {
      name: 'test user',
      avatar: 'test avatar',
      email: 'testuser@test.nl',
      dateOfBirth: dob,
      password: 'test_password',
    };
    UserProtoMock.expects('save').yields(null, user);
    // saveUser will throw an error here.
    const savedUser = await saveUser(user);
    // verify if saveUser has used the the save method on Model's prototype
    UserProtoMock.verify();
    expect(savedUser).to.be.a('object');
    expect(savedUser).to.have.property('name', 'test user');
    expect(savedUser).to.have.property('avatar', 'test avatar');
    expect(savedUser).to.have.property('email', 'testuser@test.nl');
    expect(savedUser).to.have.property('dateOfBirth', dob);
    expect(savedUser).to.have.property('password', 'test_password');
  });
});

describe('UserModel -> update user', function () {

  beforeEach(mockInit);
  afterEach(mockRestore);

  it('should throw an error when no query is passed', function () {
    expect(() => findUserAndUpdate()).to.throw(ReferenceError, 'no query specified');
  });

  it('should throw an error when the query is not an object', function () {
    expect(() => findUserAndUpdate('a string')).to.throw(TypeError, 'not a query object');
  });

  it('should throw an error when the query is empty', function () {
    expect(() => findUserAndUpdate({})).to.throw('query is empty');
  });

  it('should find update a user when an email is found', async function () {
    const expectedEmail = user_model.tom.email,
      updatedEmail = 'tom_updated@task-manager.com';
    let updatedUser = user_model.tom;
    updatedUser.email = updatedEmail;
    UserMock.expects('findOneAndUpdate').withArgs({email: expectedEmail}, {email: updatedEmail}, {new: true})
      .chain('exec').yields(null, updatedUser);
    const user = await findUserAndUpdate({email: expectedEmail}, {email: 'tom_updated@task-manager.com'});
    UserMock.verify();
    expect(user).to.be.a('object');
    // option new:true returns the updated object instead of the original document
    expect(user).to.have.property('email', updatedEmail);
  });

  it('should not update a user when an email is not found', async function () {
    const notExistingEmail = 'not an email',
      updatedEmail = 'tom_updated@task-manager.com';
    UserMock.expects('findOneAndUpdate').withArgs({email: notExistingEmail}, {email: updatedEmail}, {new: true})
      .chain('exec').yields(null, undefined);
    const user = await findUserAndUpdate({email: notExistingEmail}, {email: updatedEmail});
    UserMock.verify();
    expect(user).to.be.a('undefined')
  });
});



