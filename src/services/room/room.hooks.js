

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [async context => {
      context.data.createdAt = new Date();
      console.log('Incoming room create:', context.data);
      return context;
    }],
    update: [],
    patch: [async context => {
      if (context.data.userID) delete context.data.userID;
      if (context.data.players) {
        const incomingPlayer = Object.keys(context.data.players)[0];
        const currentObject = await context.service.get(context.arguments[0]);
        const currentPlayerNewScore = currentObject.players[incomingPlayer].score + context.data.players[incomingPlayer].score;
        context.data.players = {
          ...currentObject.players,
          [incomingPlayer]: {
            score: currentPlayerNewScore
          }
        };
      }
      return context;
    }],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      async (context) => {
        // emit status update
        context.service.emit('status', context.result);
        return context;
      }
    ],
    update: [],
    patch: [
      async (context) => {
        // emit status update
        context.service.emit('status', context.result);
        return context;
      }
    ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
