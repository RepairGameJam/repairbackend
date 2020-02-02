const { Service } = require('feathers-memory');

const generateRoomCode = () => {
  // room code between 1000 and 1999
  return Math.floor(Math.random()*999) + 1000;   
};

// const MAX_LEVELS = 3;

const LEVELS = {
  'level1': 'level1',
  'level2': 'level2',
  'level3': 'level3',
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

    let userID = data.userID;
    delete data.userID;

    const STARTING_PLAYER = { 
      score: 0,
    };

    if (existingGames[0]) {
      existingGames[0].players[userID] = STARTING_PLAYER;
    } else {
      data.players = {
        [userID]: STARTING_PLAYER
      };
    }

    if (params.connection) {
      const room = this.app.channel(`room/${roomCode}`);
      room.join(params.connection);
    }
    if (shouldCreate) {
      const created = await super.create({ ...data, roomCode, level: LEVELS.level1 }, params);
      console.log('CREATING NEW ROOM', created);
      return created;
    } else {
      console.log('SENDING EXISTING ROOMS', existingGames[0]);
      const updated = await super.patch(existingGames[0].id, { ...existingGames[0] });
      return updated;
    }
  }

  async find(params) {
    super.find(params);
  }

  async remove (id, params) {
    if (params.connection) {
      this.app.channel(`room/${id}`).leave(params.connection);
    }
  }

  async patch(id, data, params) {
    if(data.state === 'levelComplete') {
      this.levelComplete(id);
    }
    return super.patch(id, data, params);
  }

  async levelComplete(id) {
    const currentGame = await this.get(id);
    setTimeout(() => {
      this.patch(id, { state: 'leaderboard' });
    }, 200);

    setTimeout(() => {

      // to do: check if we can set to next level otherwise send complete
      let send = {};
      send.state = 'playing';
      switch(currentGame.level) {
      case LEVELS.level1:
        send.level = LEVELS.level2;
        break;
      case LEVELS.level2:
        send.level = LEVELS.level3;
        break;
      default: 
      case LEVELS.level3:
        send.level = null;
        send.state = 'complete';
        break;
      }

      this.patch(id, send);
    }, 4200);
  }

};
