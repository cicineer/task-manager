const expect = require('chai').expect;
const should = require('chai').should();
const sinon = require('sinon');
require('sinon-mongoose');
const user_model = require('../../factory/user_factory.json');
const {findUser, findUserAndUpdate, saveUser, User} = require('../../model/user_model');

let UserMock;
let UserProtoMock;

const mockInit = function () {
  UserMock = sinon.mock(User);
  UserProtoMock = sinon.mock(User);
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


// describe('UserModel -> update a user', function () {
//
//   beforeEach(mockInit);
//   afterEach(mockRestore);
//
//   it('should save user', async () => {
//     const expectedUser = user_model.tom;
//     try {
//       // const result = await saveUser(expectedUser);
//       // sinon.assert.calledWith(User.prototype.save);
//       UserProtoMock.expects('save').yields(null, expectedUser);
//       // returned a promise from save user
//       const result = await saveUser(expectedUser);
//       expect(result).to.be.a('object');
//       expect(result).to.have.property('name', expectedUser.name);
//     } catch (e) {
//       console.log(e)
//     }
//
//   });
//   it('should not save user when property missing', function () {
//     const newUser = new User();
//     newUser.validate(function (err) {
//       expect(err.errors.name).to.exist;
//     })
//   });
//
//   it('should not save user when email already exists', async function () {
//     const user = user_model.tom;
//     const expectedEmail = user_model.tom.email;
//     UserMock.expects('findOne').withArgs({email: expectedEmail}).chain('exec').yields(null, user);
//     const result = await saveUser(user);
//     console.log(result);
//   });
//
//   it('should find this user by email', async function () {
//     const expectedUser = user_model.tom;
//     try {
//       UserMock.expects('findOne').withArgs({name: expectedUser.email}).chain('exec').yields(null, expectedUser);
//       const user = await checkExistEmail(expectedUser);
//       // sinon.assert.calledWith(User.findOne, {name: expectedUser.name});
//       expect(user).to.be.a('object');
//       expect(user).to.have.property('name', expectedUser.name);
//       expect(user).to.have.property('email', expectedUser.email)
//     } catch (e) {
//       console.log(e);
//     }
//   })
// });

