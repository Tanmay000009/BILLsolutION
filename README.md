# BILLsolutION
BILLION is a sophisticated billing system crafted with Node.js and powered by PostgreSQL for efficient invoicing, seamless payments, and precise financial management. Leveraging the capabilities of TypeORM and TypeScript, it provides a user-friendly API for creating accounts, managing cart items, viewing accurate tax breakdowns, and confirming orders. The project is also seamlessly integrated with Postman for thorough testing and validation.

## Resources

- [Postman collection](https://www.postman.com/tanmay000009/workspace/billsolution)

### Built With

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
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

# Quick Answers to Key Questions

1. Why not add a constraint for Unique Names for Products and Services?
  > Billion can be a B2C, or a marketplace. So to accommodate both concepts it's not enforced.

2. Why is the invoice reprocessed when creating an order?
  > It is to calculate Tax and Prices in real-time, as there might be updation, and currently, checkout sessions aren't accommodated.

3. Why use Firebase for authentication?
  > BILLION employs the robust security features provided by Firebase authentication. Firebase offers industry-standard security protocols, including secure password hashing, OAuth2-based authentication, and user identity management.

4. Why Are Firebase Credentials Publicly Available in the Repo?
  > Firebase credentials are intentionally shared for ease of testing, allowing users to quickly evaluate BILLION's functionality. However, it's essential to follow secure practices for production use to ensure data protection.

## Contact

Tanmay Vyas

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Tanmay000009)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tanmay-vyas-09/)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:tanmayvyas09@gmail.com)
[![Resume](https://img.shields.io/badge/Resume-000000?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://drive.google.com/file/d/1lkfmeqseeSwK1GlJHEblz2ZuYzdNBRhm/view?usp=drive_link)
