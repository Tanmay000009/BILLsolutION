# BILLsolutION

BILLION is a sophisticated billing system crafted with Node.js and powered by PostgreSQL for efficient invoicing, seamless payments, and precise financial management. Leveraging the capabilities of TypeORM and TypeScript, it provides a user-friendly API for creating accounts, managing cart items, viewing accurate tax breakdowns, and confirming orders. The project is also seamlessly integrated with Postman for thorough testing and validation.

## Resources

- [Postman collection](https://www.postman.com/tanmay000009/workspace/billsolution)

## Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-E83422?style=for-the-badge&logo=typeorm&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=Docker&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=Babel&logoColor=black)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black)

## Getting Started

### Important Notes

- Seed the database before starting the server. It will create an admin account, few accounts for testing, and some products and services.

```sh
npm run seed
```

- Seeding the database will create an admin account with the following credentials:

```sh
email: admin@billion.com
password: Billion@123
```

- Seeding also creates a few accounts for testing purposes. The credentials are:

```sh
email: testuser@billion.com
password: Billion@123
```

```sh
email: testadmin@billion.com
password: Billion@123
```

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v20.3.0)
- [PostgreSQL](https://www.postgresql.org/download/) (Local/Cloud)
- [Postman](https://www.postman.com/downloads/) (Optional)
- [Firebase](https://firebase.google.com/)
- [Docker](https://www.docker.com/) (Optional)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/Tanmay000009/BILLsolutION
   ```

2. Setup `.env` with `sample.env` as refrence

### Running Server Locally

1. Install NPM packages

   ```sh
   npm install
   ```

### Commands

- `npm run start:dev` - Start the development server.
- `npm run build` - Build the project.
- `npm run start` - Start the production server.
- `npm run test` - Run tests.
- `npm run seed` - Seed the database.

- The application will be accessible at `http://localhost:3000`.

### Using Docker Compose

1. Make sure you have Docker and Docker Compose installed on your system.
2. Clone the repository.
3. Navigate to the root directory of the project.
4. Run the following command to build and start the application in Docker containers:

```
docker-compose up -d
```

OR

```
./compose.sh
```

> If you are facing permission issues, run the following command:

```
chmod +x compose.sh
```

> The application will be accessible at http://localhost:3000.

### Using Docker Image

1. Make sure you have Docker installed on your system.
2. Clone the repository.
3. Navigate to the root directory of the project.
4. Take reference from the `.env.example` file to create the environment file `.env` and update the environment variables as needed.
5. Run the following command to build the Docker image:

```
./run.sh
```

OR

> Build the Docker image using the current directory as the build context

```
docker build -t <image-name>:<tag> .
```

> Run the Docker container interactively, mapping the required port (3000 in this case)
> and using the .env file from the host machine as a volume inside the container

```
docker run -it -p 3000:3000 --env-file .env <image-name>:<tag>
```

6. If you are facing permission issues, run the following command:

```
chmod +x run.sh
```

7. The application will be accessible at http://localhost:3000.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Testing

```sh
npm run test
```

## Checklist

### Must haves

- [x] Create an account.
- [x] Fetch all products and service information with their prices.
- [x] Add a product or service to the cart.
- [x] Remove a product or service from the cart.
- [x] Clear the cart.
- [x] View total bill (should include price, quantity, and tax on each item as well as total value of selected items)
- [x] Confirm the order

### Good to haves

- [ ] Additional API for admin to see all the orders.
- [x] Appropriate test cases to simulate practical scenarios that you would want to test the system for.

<p align="right">(<a href="https://github.com/Tanmay000009/BILLsolutION#billsolution">back to top</a>)</p>

## Quick Answers to Key Questions

1. Why not add a constraint for Unique Names for Products and Services?

   > Billion can be a B2C, or a marketplace. So to accommodate both concepts it's not enforced.

2. Why is the invoice reprocessed when creating an order?

   > It is to calculate Tax and Prices in real-time, as there might be updation, and currently, checkout sessions aren't accommodated.

3. Why use Firebase for authentication?

   > BILLION employs the robust security features provided by Firebase authentication. Firebase offers industry-standard security protocols, including secure password hashing, OAuth2-based authentication, and user identity management.

4. Why Are Firebase Credentials Publicly Available in the Repo?
   > Firebase credentials are intentionally shared for ease of testing, allowing users to quickly evaluate BILLION's functionality. However, it's essential to follow secure practices for production use to ensure data protection.

<p align="right">(<a href="https://github.com/Tanmay000009/BILLsolutION#billsolution">back to top</a>)</p>

## Module Description

### Auth

- Create an account. `POST /auth/signup`
- Create Admin account. `POST /auth/signup/admin` `Access: Admin`
- Login to an account. `POST /auth/signin`
- Forgot Password. `POST /auth/forgot-password/:email`
- Update Password. `POST /auth/update-password`

### Cart

- Get Cart Items. `GET /cart` `Access: User/Admin`
- Add Items to Cart. `POST /cart` `Access: User/Admin`
- Update Items in Cart. `PUT /cart` `Access: User/Admin`
- Remove Items from Cart. `DELETE /cart` `Access: User/Admin`
- Clear Cart. `PUT /cart` `Access: User/Admin`

### Order

- Get Orders for User. `GET /order` `Access: User`
- Get All Orders. `GET /order/admin` `Access: Admin`
- Generate Invoice. `POST /order/invoice` `Access: User/Admin`
- Create Order. `POST /order/create` `Access: User/Admin`
- Process Order. (Mark order as COMPLETED or FAILED) `PUT /order/process` `Access: Admin`
- Cancel Order. `PUT /order/:id/cancel` `Access: User`

### Product

- Get All Products. `GET /product` `Access: User/Admin`
- Get Product by ID. `GET /product/:id` `Access: User/Admin`
- Create Product. `POST /product` `Access: Admin`
- Update Product. `PUT /product/:id` `Access: Admin`
- Delete Product. `DELETE /product/:id` `Access: Admin`

### Service

- Get All Services. `GET /service` `Access: User/Admin`
- Get Service by ID. `GET /service/:id` `Access: User/Admin`
- Create Service. `POST /service` `Access: Admin`
- Update Service. `PUT /service/:id` `Access: Admin`
- Delete Service. `DELETE /service/:id` `Access: Admin`

### User

- Get User Details. `GET /user` `Access: User/Admin`
- Update User Details. `PUT /user` `Access: User/Admin`
- Make User Admin. `PUT /user/:email/admin` `Access: Admin`

<p align="right">(<a href="https://github.com/Tanmay000009/BILLsolutION#billsolution">back to top</a>)</p>

## Contact

Tanmay Vyas

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Tanmay000009)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tanmay-vyas-09/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:tanmayvyas09@gmail.com)
[![Resume](https://img.shields.io/badge/Resume-000000?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://drive.google.com/file/d/1lkfmeqseeSwK1GlJHEblz2ZuYzdNBRhm/view?usp=drive_link)
