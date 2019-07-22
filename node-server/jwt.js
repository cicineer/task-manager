const expressJwt = require('express-jwt');

const jwtAuth = expressJwt({secret: 'angular_taskmgr_jwttoken'})
  .unless({path: ["/auth/login", "/auth/register", "/auth/reset", "/auth/forget"]});

module.exports = jwtAuth;
