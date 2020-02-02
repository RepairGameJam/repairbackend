const app = require('../../src/app');

describe('\'room\' service', () => {
  it('registered the service', () => {
    const service = app.service('room');
    expect(service).toBeTruthy();
  });
});
