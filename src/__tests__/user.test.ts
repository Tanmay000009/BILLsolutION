import supertest from 'supertest';
import request from 'supertest';
import initServer from '../utils/server';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { ds } from '../utils/datasource';

const app = initServer();

describe('User Routes', () => {
  let adminAccessToken = '';
  let userAccessToken = '';

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
  });

  afterAll(async () => {
    ds.destroy();
  });

  describe('Get User', () => {
    describe('When the token is not provided', () => {
      it('GET /user', async () => {
        const response = await supertest(app).get('/user');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('GET /user', async () => {
        const response = await supertest(app)
          .get('/user')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is  authenticated', () => {
      it('GET /user', async () => {
        const response = await request(app)
          .get('/user')
          .set('authorization', userAccessToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User found');
        expect(response.body.data).toBeDefined();
      });
    });
  });

  describe('Update User', () => {
    describe('When the token is not provided', () => {
      it('PUT /user', async () => {
        const response = await supertest(app).put('/user');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('PUT /user', async () => {
        const response = await request(app)
          .put('/user')
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is authenticated', () => {
      it('PUT /user', async () => {
        const response = await request(app)
          .put('/user')
          .set('authorization', userAccessToken)
          .send({
            firstName: 'New First Name',
            lastName: 'New Last Name'
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('User updated successfully');
        expect(response.body.data).toBeDefined();
      });
    });
  });

  describe('Make User Admin', () => {
    describe('When the token is not provided', () => {
      it('PUT /user/make-admin', async () => {
        const response = await supertest(app).put('/user/make-admin').query({
          email: 'testuser@billion.com'
        });

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('PUT /user/make-admin', async () => {
        const response = await supertest(app)
          .put('/user/make-admin')
          .query({
            email: 'testuser@billion.com'
          })
          .set('authorization', 'randomToken');

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the authenticated user is not an admin', () => {
      it('PUT /user/make-admin', async () => {
        const response = await supertest(app)
          .put('/user/make-admin')
          .query({
            email: 'testuser@billion.com'
          })
          .set('authorization', userAccessToken);

        expect(response.status).toBe(403);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Forbidden');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the authenticated user is an admin', () => {
      it('PUT /user/make-admin', async () => {
        const response = await supertest(app)
          .put('/user/make-admin')
          .set('authorization', adminAccessToken)
          .query({
            email: 'testuser@billion.com'
          });

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Admin Role assigned successfully');
        expect(response.body.data).toBeDefined();
      });
    });

    describe('When the user to make is already an admin', () => {
      it('PUT /user/make-admin', async () => {
        const response = await supertest(app)
          .put('/user/make-admin')
          .query({
            email: 'testuser@billion.com'
          })
          .set('authorization', adminAccessToken);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('User is already a Admin');
        expect(response.body.data).toBeNull();
      });
    });
  });

  describe('Make Admin -> Normal User', () => {
    describe('When the token is not provided', () => {
      it('PUT /user/make-normal', async () => {
        const response = await supertest(app).put('/user/make-normal').query({
          email: 'testuser@billion.com'
        });

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('No token provided');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is not authenticated', () => {
      it('PUT /user/make-normal', async () => {
        const response = await supertest(app)
          .put('/user/make-normal')
          .set('authorization', 'randomToken')
          .query({
            email: 'testuser@billion.com'
          });

        expect(response.status).toBe(401);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Invalid token');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the authenticated user is an admin', () => {
      it('PUT /user/make-normal', async () => {
        const response = await supertest(app)
          .put('/user/make-normal')
          .query({
            email: 'testuser@billion.com'
          })
          .set('authorization', adminAccessToken);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe(true);
        expect(response.body.message).toBe('Admin Role removed successfully');
        expect(response.body.data).toBeDefined();
      });
    });

    describe('When the authenticated user is not an admin', () => {
      it('PUT /user/make-normal', async () => {
        const response = await supertest(app)
          .put('/user/make-normal')
          .query({
            email: 'testuser@billion.com'
          })
          .set('authorization', userAccessToken);

        expect(response.status).toBe(403);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('Forbidden');
        expect(response.body.data).toBeNull();
      });
    });

    describe('When the user is already normal user', () => {
      it('PUT /user/make-normal', async () => {
        const response = await supertest(app)
          .put('/user/make-normal')
          .query({
            email: 'testuser@billion.com'
          })
          .set('authorization', adminAccessToken);

        expect(response.status).toBe(400);
        expect(response.body.status).toBe(false);
        expect(response.body.message).toBe('User is not an Admin User');
        expect(response.body.data).toBeNull();
      });
    });
  });
});
