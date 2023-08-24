import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { productRepo } from '../repos/product.repo';
import { serviceRepo } from '../repos/service.repo';
import supertest from 'supertest';
import initServer from '../utils/server';
import { Product } from '../models/Product.model';
import { Service } from '../models/Service.model';
import { ZERO_UUID } from '../utils/constants';
import { ds } from '../utils/datasource';

const app = initServer();

describe('Cart Routes', () => {
  let adminAccessToken = '';
  let userAccessToken = '';
  let product: Product | null = null;
  let service: Service | null = null;
  beforeAll(async () => {
    const auth = getAuth();
    await signInWithEmailAndPassword(
      auth,
      'testadmin@billion.com',
      'Billion@2023'
    ).then(async (userCredential) => {
      adminAccessToken = await userCredential.user.getIdToken();
    });

    await signInWithEmailAndPassword(
      auth,
      'testuser@billion.com',
      'Billion@2023'
    ).then(async (userCredential) => {
      userAccessToken = await userCredential.user.getIdToken();
    });

    const seedData = await seed();
    product = seedData.product;
    service = seedData.service;
  });

  afterAll(async () => {
    await clearTestSeed(product!.id, service!.id);
    ds.destroy();
  });

  describe('Get Cart', () => {
    describe('When the token is not provided', () => {
      it('GET /cart', async () => {
        const response = await supertest(app).get('/cart');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('GET /cart', async () => {
        const response = await supertest(app)
          .get('/cart')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is authenticated', () => {
      it('GET /cart', async () => {
        const response = await supertest(app)
          .get('/cart')
          .set('authorization', userAccessToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Cart Items found');
        expect(response.body.data).not.toBeNull();
      });
    });
  });

  describe('Clear Cart', () => {
    describe('When the token is not provided', () => {
      it('PUT /cart/clear', async () => {
        const response = await supertest(app).put('/cart/clear');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('PUT /cart/clear', async () => {
        const response = await supertest(app)
          .put('/cart/clear')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is authenticated', () => {
      it('PUT /cart/clear', async () => {
        const response = await supertest(app)
          .put('/cart/clear')
          .set('authorization', userAccessToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Cart cleared successfully');
        expect(response.body.data).toHaveLength(0);
      });
    });
  });

  describe('Add to Cart', () => {
    describe('When the token is not provided', () => {
      it('POST /cart', async () => {
        const response = await supertest(app).post('/cart');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('POST /cart', async () => {
        const response = await supertest(app)
          .post('/cart')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is authenticated', () => {
      it('POST /cart ', async () => {
        if (!product) {
          throw new Error('Product not found');
        }

        const response = await supertest(app)
          .post('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: product.id,
                itemType: 'PRODUCT',
                quantity: 1
              }
            ]
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Items added to cart');
        expect(response.body.data).toHaveLength(1);
      });
    });

    describe('Adding same service twice', () => {
      it('POST /cart ', async () => {
        if (!service) {
          throw new Error('Service not found');
        }

        const response = await supertest(app)
          .post('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: service.id,
                itemType: 'SERVICE',
                quantity: 1
              },
              {
                itemId: service.id,
                itemType: 'SERVICE',
                quantity: 1
              }
            ]
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Items added to cart');
        expect(response.body.data).toHaveLength(2);
        const serviceItem = response.body.data.find(
          (item: any) => item.itemType === 'SERVICE'
        );
        expect(serviceItem.quantity).toBe(2);
      });
    });

    describe('Adding item with quantity 0', () => {
      it('POST /cart ', async () => {
        if (!service) {
          throw new Error('Service not found');
        }

        const response = await supertest(app)
          .post('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: service.id,
                itemType: 'SERVICE',
                quantity: 0
              }
            ]
          });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Validation Error');
      });
    });

    describe('Adding item which doesnt exist', () => {
      it('POST /cart ', async () => {
        const response = await supertest(app)
          .post('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: ZERO_UUID,
                itemType: 'SERVICE',
                quantity: 1
              }
            ]
          });

        expect(response.status).toBe(404);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('One or More Service not found');
      });
    });
  });

  describe('Update Cart', () => {
    describe('When the token is not provided', () => {
      it('PUT /cart', async () => {
        const response = await supertest(app).put('/cart');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('PUT /cart', async () => {
        const response = await supertest(app)
          .put('/cart')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is authenticated', () => {
      it('PUT /cart ', async () => {
        if (!product) {
          throw new Error('Product not found');
        }

        const id = product.id;

        const response = await supertest(app)
          .put('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: product.id,
                itemType: 'PRODUCT',
                quantity: 3
              }
            ]
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Cart Items updated');
        const productItem = response.body.data.find(
          (item: any) => item.itemType === 'PRODUCT' && item.itemId === id
        );
        expect(productItem.quantity).toBe(3);
      });
    });

    describe('Updating same service twice', () => {
      it('PUT /cart ', async () => {
        if (!service) {
          throw new Error('Service not found');
        }

        const response = await supertest(app)
          .put('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: service.id,
                itemType: 'SERVICE',
                quantity: 3
              },
              {
                itemId: service.id,
                itemType: 'SERVICE',
                quantity: 3
              }
            ]
          });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Duplicate items are not allowed');
        expect(response.body.data).toBeNull();
      });
    });

    describe('Updating item with quantity 0', () => {
      it('PUT /cart ', async () => {
        if (!service) {
          throw new Error('Service not found');
        }

        const response = await supertest(app)
          .put('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: service.id,
                itemType: 'SERVICE',
                quantity: 0
              }
            ]
          });

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Validation Error');
      });
    });

    describe('Updating item which doesnt exist', () => {
      it('PUT /cart ', async () => {
        const response = await supertest(app)
          .put('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: ZERO_UUID,
                itemType: 'SERVICE',
                quantity: 1
              }
            ]
          });

        expect(response.status).toBe(404);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('One or More Service not found');
      });
    });
  });

  describe('Remove from Cart', () => {
    describe('When the token is not provided', () => {
      it('DELETE /cart', async () => {
        const response = await supertest(app).delete('/cart');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('DELETE /cart', async () => {
        const response = await supertest(app)
          .delete('/cart')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is authenticated', () => {
      it('DELETE /cart ', async () => {
        if (!product) {
          throw new Error('Product not found');
        }

        const id = product.id;

        const response = await supertest(app)
          .delete('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: id,
                itemType: 'PRODUCT'
              }
            ]
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Cart Items removed successfully');
        expect(response.body.data).not.toBe(null);
        const productItem = response.body.data.find(
          (item: any) => item.itemType === 'PRODUCT' && item.itemId === id
        );
        expect(productItem).toBe(undefined);
      });
    });

    describe('Remove same service twice', () => {
      it('DELETE /cart ', async () => {
        if (!service) {
          throw new Error('Service not found');
        }

        const id = service.id;

        const response = await supertest(app)
          .delete('/cart')
          .set('authorization', userAccessToken)
          .send({
            items: [
              {
                itemId: service.id,
                itemType: 'SERVICE'
              },
              {
                itemId: service.id,
                itemType: 'SERVICE'
              }
            ]
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Cart Items removed successfully');
        expect(response.body.data).toHaveLength(0);
        const serviceItem = response.body.data.find(
          (item: any) => item.itemType === 'SERVICE' && item.itemId === id
        );
        expect(serviceItem).toBe(undefined);
      });
    });
  });
});

const product = {
  name: 'Apple MacBook Air',
  description: 'One of the best in the game.',
  price: 94999,
  image: ''
};

const service = {
  name: 'Laptop Servicing',
  description: 'Get your laptop cleaned.',
  price: 999,
  image: ''
};

const seed = async () => {
  const p = await productRepo.createProduct(product);
  const s = await serviceRepo.createService(service);

  return {
    product: p,
    service: s
  };
};

const clearTestSeed = async (productId: string, serviceId: string) => {
  await productRepo.deleteProduct(productId);
  await serviceRepo.deleteService(serviceId);
};
