const room = require('./room/room.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(room);
};
