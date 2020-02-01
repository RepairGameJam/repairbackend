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
    // room code between 1000 and 1999
    const roomCode = generateRoomCode();
    console.log('TCL: Room -> create -> roomCode', roomCode);
      
    try {
      if (params.connection) {
        console.log('TCL: Room -> create -> params.connection', params.connection);
        const room = this.app.channel(`room/${roomCode}`);
        room.join(params.connection);
        this.emit('status', { holdon: true, roomCode });
        console.dir(' CHANNEL CODE', room);
      }
    } catch (error) {
      console.error('======= erro joining', error);
    }
    
    // Call the original `create` method with existing `params` and new data
    return super.create({ ...data, roomCode }, params);
    // return data;
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
