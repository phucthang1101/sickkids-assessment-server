const crypto = require('crypto');

exports.genAccessToken = (strToEncode, salt) => {
  console.log({ strToEncode }, { salt });
  if (!strToEncode) return '';
  try {
    return crypto.createHmac('sha256', salt).update(strToEncode).digest('hex');
  } catch (err) {
    return '';
  }
};
