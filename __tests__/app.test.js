const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        // expect(createMessage).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 10,
        });
      });
  });

  it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    expect(res.body).toEqual({
      id: '1',
      quantity: 10,
    });
  });

  it('gets all orders', async () => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 11 });

    const results = await request(app)
      .get('/api/v1/orders')

    expect(results.body).toEqual([
      {
      id: '1',
      quantity: 10,
      },
      {
      id: '2',
      quantity: 11,
      }
    ]);
  });

  it('gets an order by id', async () => {
    const order = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
    const results = await request(app)
      .get(`/api/v1/orders/${order.body.id}`)

    expect(results.body).toEqual({
      id: '1',
      quantity: 10,
      })
  });

  it('updates an order', async () => {

    const order = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });

    const putResult = await request(app)
      .put(`/api/v1/orders/${order.body.id}`)
      .send({quantity: '45'})
      
    const results = await request(app)
      .get(`/api/v1/orders/${order.body.id}`)

    expect(results.body).toEqual({
      id: '1',
      quantity: 45,
      })
  });


});
