const dotenv = require('dotenv');
const path = require('path');


dotenv.config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: process.env.PORT,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  zoom00: {
    url: process.env.ZOOM_00_URL,
    token: process.env.ZOOM_00_TOKEN,
  },
  github00: {
    secret: process.env.GITHUB_00_SECRET,
  },
  jwtTokenSecret: process.env.JWT_SECRET,
};