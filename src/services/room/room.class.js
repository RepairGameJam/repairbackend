const { Service } = require('feathers-memory');

const generateRoomCode = () => {
  // room code between 1000 and 1999
  return Math.floor(Math.random()*999) + 1000;   
};

exports.Room = class Room extends Service {
  constructor(options, app) {
    super(options);
    this.app = app;
  }
  async create (data, params) {
    const existingGames = await super.find({}).then(results => results.data);
    let roomCode = generateRoomCode();
    let shouldCreate = true;
    if(existingGames[0]) {
      shouldCreate = false;
      roomCode = existingGames[0].roomCode;
    }
      
    if (params.connection) {
      const room = this.app.channel(`room/${roomCode}`);
      room.join(params.connection);
      this.emit('status', { holdon: true, roomCode });
    }
    if (shouldCreate) {
      const created = await super.create({ ...data, roomCode }, params);
      console.log('CREATING NEW ROOM', created);
      return created;
    } else {
      console.log('SENDING EXISTING ROOMS');
      return existingGames[0];
    }
  }

  async find(params) {
    console.log('PARAMS FROM FIND', params);
    super.find(params);
  }

  async remove (id, params) {
    if (params.connection) {
      this.app.channel(`room/${id}`).leave(params.connection);
    }
  }

};