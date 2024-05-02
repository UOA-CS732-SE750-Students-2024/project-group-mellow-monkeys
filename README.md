# Bobu Chatbot - MERN Stack
This repository contains my solution for the challenge of creating a chatbot using the MERN stack and integrating with the OpenAI API.

## Features
 - User registration and login functionality.
 - Homepage where users can interact with the Bobu chatbot.
 - Clean code implementation following best practices.


## Installation
To run this project, please follow these steps:

1. Clone the repository to your local machine.
2. In order to run the application successfully, make sure you have a .env file in both backend and frontend folder with the configuration like this(For '', fill in appropriate content. Specific content is not provided here for security reasons):
``` plaintext
API_KEY='chatGPT API key'
DB_USER='database username'
DB_PASS='database password'
JWT_SECRET='jwt secrter'
```
3. Navigate to the chatbot-frontend directory and run the following command in your terminal to install dependencies:
```bash
cd chatbot-frontend
```
```bash
npm install
```
4. After the installation is complete, start the development server by running the command:
```bash
npm run dev
```
5. Open a separate terminal window, navigate to the chatbot-backend directory, and run the following command to install dependencies:
```bash
cd chatbot-backend
```
```bash
npm install
```
6. Once the installation is finished, start the backend server by running the command:
```bash
npm start
```
7. After both frontend and backend servers are up and running, access the URL shown in the frontend terminal to use the application.

## Frontend Dependencies
The following dependencies were used in the frontend:
- React

## Backend Dependencies
The following dependencies were used in the backend:
- Express
- Node.js
- MongoDB

## Testing
For testing purposes, you can use the following credentials to register in the backend:

- Email: test@123.com
- Password: test

This application includes some frontend test files, primarily based on the Jest and Babel environment to complete the testing. To run the test files, please navigate to the frontend folder using the following statement:
```bash
cd chatbot-frontend
```

Once successfully navigated, input the following statement in the console to download dependencies:
```bash
npm install --save-dev jest jsdom babel-jest @babel/core @babel/preset-env typescript ts-jest
```

After all dependencies are downloaded, input the following command to run the test files:
```bash
npm test
```

## Deployment
The deployment of this application is separated into frontend and backend. The frontend deployment relies on Netlify, while the backend deployment relies on Heroku. The database is hosted on MongoDB Atlas. You can access the deployed software and test its functionality through the following links

```bash
npm test
```
https://mellow-monkeys.netlify.app/

## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.

Feel free to reach out to me if you have any questions or need further assistance. Happy coding!
