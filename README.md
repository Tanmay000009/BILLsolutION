# BILLsolutION

BILLION is a sophisticated billing system crafted with Node.js and powered by PostgreSQL for efficient invoicing, seamless payments, and precise financial management. Leveraging the capabilities of TypeORM and TypeScript, it provides a user-friendly API for creating accounts, managing cart items, viewing accurate tax breakdowns, and confirming orders. The project is also seamlessly integrated with Postman for thorough testing and validation.

## Resources

- [Postman collection](https://www.postman.com/tanmay000009/workspace/billsolution)

### Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-E83422?style=for-the-badge&logo=typeorm&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E.svg?style=for-the-badge&logo=Prettier&logoColor=black)

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
- [ ] Appropriate test cases to simulate practical scenarios that you would want to test the system for.

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
