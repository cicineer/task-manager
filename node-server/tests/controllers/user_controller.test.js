const sinon = require('sinon');
const expect = require('chai').expect;

const mockResponse = () => {
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

const mockRequest = (jwtoken, body) => ({

});

describe('UserController -> login', function () {
  it('should return 400 if user name is missing from the body', function () {
    const req = mockRequest
  })
});


