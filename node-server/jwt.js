const expressJwt = require('express-jwt');
const { secretKey } = require('./constant');

const jwtAuth = expressJwt({secret: secretKey}).unless({path: ["/auth/login", "/auth/register", "/auth/reset", "/auth/forget"]});

module.exports = jwtAuth;
