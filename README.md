# Soulmate Chatbot - MERN Stack
This repository contains my solution for the challenge of creating a chatbot using the MERN stack and integrating with the OpenAI API.

## Features
 - User registration and login functionality.
 - Homepage where users can interact with the Soulmate chatbot.
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

## API
This project consists of a custom API and integration with the OpenAI API.
1. The Custom API is mainly used for logging in, registering, storing user information, and storing information about chat recipients. It provides the following functions:
- User Registration
- User Login
- Storing user information
- Storing chat object information
2. The OpenAI API is used to generate images and dialogues.
3. Make sure you have obtained an OpenAI API key (but don't worry, in this project we have already got the API key. We have submitted API key to Andrew.In case if you did not get the key from him, feel free to connect us. Once you obtain the API  key, paste it into the chatbot-frontend/.env file and chatbot-backend/.env file.). 
- Visit the official OpenAI API website, link: https://platform.openai.com/docs/overview
- Register for an account and follow the instructions to obtain an API key.
4. To ensure that the OpenAI API would meet our needs, we customised a specific template in advance. This tailored template goes a long way to ensuring that the content generated meets our expectations as well as being more contextual, providing a more personalised and effective service to our users.


## Testing

This section provides instructions on how to run tests for the chatbot-frontend project. The project includes test files for various components including Login, Register, SurveyPage, and UserInfoPage.

To set up the testing environment for the project, follow these steps:
1.Navigate to the Project Directory:
```bash
cd chatbot-frontend
```
2.Install Dependencies:
Install Jest along with other necessary packages for testing React components with Jest in a TypeScript environment.
```bash
npm install --save-dev jest jsdom babel-jest @babel/core @babel/preset-env typescript ts-jest
```

3.Running Tests
To run all test files associated with the project, use the following command:
```bash
npm test
```
This command will execute all test files in the project, including:

Login.test.js: Tests for the Login component.
Register.test.js: Tests for the Register component.
Surveypage.test.js: Tests for the SurveyPage component.
UserInfoPage.test.js: Tests for the UserInfoPage component.
These tests ensure that each component functions correctly under various conditions and that they handle states and events as expected.

## Deployment
The deployment of this application is separated into frontend and backend. The frontend deployment relies on Netlify, while the backend deployment relies on Heroku. The database is hosted on MongoDB Atlas. You can access the deployed software and test its functionality through the following links

**Deployment**
   [![Project Management](https://imgur.com/IFhV9S0.png)](https://imgur.com/IFhV9S0)

```bash
https://mellow-monkeys.netlify.app/
```
## Project Management and Documentation with Notion 
Notion serves as our central hub for both task management and project documentation. It provides a collaborative environment where team members can efficiently create and assign tasks, set deadlines, and track progress throughout the project lifecycle. Additionally, Notion allows for the organization and sharing of a wide range of documents, including meeting minutes, design specifications, technical documentation, and user guides. As a versatile platform, it ensures that all essential project information and tasks are easily accessible and well-managed, facilitating communication among team members.
```bash
https://www.notion.so/8b6660ce81b245d9821524f6da1ac444?v=221ddcc5d9ee4405a77a14c518783d0f
```
**Project Management**
   [![Project Management](https://imgur.com/x5XmdOm.png)](https://imgur.com/x5XmdOm)

## UI design with Figma
During the initial stages of the project, we leveraged Figma to conceptualize and design the user interface and user experience. Figma's cloud-based platform supports real-time collaboration, enabling multiple team members to simultaneously work on designs and provide immediate feedback in a visually engaging environment.
```bash
https://www.figma.com/file/1DOO2SUwypMP8JaEsYBsVp/Chatboat-(Community)?type=design&node-id=0-1&mode=design&t=zJFRnFMNk78Dok8S-0
```

1. **Login**
   [![Login](https://i.imgur.com/iVl1aSh.png)](https://imgur.com/iVl1aSh)

2. **Sign up**
   [![Sign up](https://i.imgur.com/iLLZE6T.png)](https://imgur.com/iLLZE6T)

3. **Homepage**
   [![Homepage](https://i.imgur.com/Lk9Rz9H.png)](https://imgur.com/Lk9Rz9H)

4. **Create Lover**
   [![Create Lover](https://i.imgur.com/1IuzUiZ.png)](https://imgur.com/1IuzUiZ)

5. **Userpage**
   [![Userpage](https://i.imgur.com/nG2GcOV.png)](https://imgur.com/nG2GcOV)

6. **Settings**
   [![Modify](https://i.imgur.com/7n828NO.png)](https://imgur.com/7n828NO)

   
## License
This project is licensed under the MIT License. Feel free to use and modify it as needed.

Feel free to reach out to me if you have any questions or need further assistance. Happy coding!
