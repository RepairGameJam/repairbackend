

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
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
