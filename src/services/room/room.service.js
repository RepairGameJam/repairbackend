// Initializes the `room` service on path `/room`
const { Room } = require('./room.class');
const hooks = require('./room.hooks');

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate'),
    events: ['status','join']
  };

  // Initialize our service with any options it requires
  app.use('/room', new Room(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('room');

  service.hooks(hooks);
};
