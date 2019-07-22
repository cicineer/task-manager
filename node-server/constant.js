const crypto = require('crypto');

module.exports = {
  MD5_SUFFIX: 'angular-taskmgr-salt',
  md5: (pwd) => {
    let md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
  },
  secretKey: 'angular_taskmgr_jwttoken'
};
