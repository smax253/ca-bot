# CA Bot
Discord bot for managing a CA office hours and help server  
[![Coverage Status](https://coveralls.io/repos/github/smax253/ca-bot/badge.svg?branch=master)](https://coveralls.io/github/smax253/ca-bot?branch=master)
[![Build Status](https://travis-ci.com/smax253/ca-bot.svg?branch=master)](https://travis-ci.com/smax253/ca-bot)
[![CodeFactor](https://www.codefactor.io/repository/github/smax253/ca-bot/badge/master)](https://www.codefactor.io/repository/github/smax253/ca-bot/overview/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/94e33e920cf5b7de840e/maintainability)](https://codeclimate.com/github/smax253/ca-bot/maintainability)
![GitHub](https://img.shields.io/github/license/smax253/ca-bot)  
***

CA Bot is a discord bot designed to help course assistants/teaching assistants manage an office hours/general help discord server during the online nature of education during the COVID-19 pandemic. 
Features include allowing students to queue for help, allowing the TAs to call students according to the queue, and starting and stopping office hours. All commands are fully customizable with the locale files.

# Technology Stack
- [Node.js v12](https://nodejs.org/en/)
- [Jest](https://jestjs.io/)
- [discord.js](https://discord.js.org/)
- [MongoDB](https://www.mongodb.com/)
- [Heroku](https://www.heroku.com/)

# Deploying it yourself
1. Fork this project and clone it on your machine
2. Create a Discord bot [here](https://discord.com/developers/)
    - Use this permission integer for your discord bot invite link: 285420592
    - Grab the Discord Bot Token, you'll need this later
3. Create a MongoDB Cluster [here](https://cloud.mongodb.com)
    - Grab the MongoDB URI, with your username and password
4. Copy the contents of .exampleenv into a file named .env
5. Replace the corresponding filler text with your Discord Bot Token and MongoDB URI
6. Run ```npm install``` and ```npm start```
7. If everything does well, you should see a message like ```Logged in as ...```

# Other commands
```$ npm run test``` will run all tests.  
```$ npm run lint``` will lint files according to the configuration.  
```$ npm run test:watch``` will run jest tests in watch mode.  
```$ npm run test:coverage``` will run all test and generate a coverage report.  
```# npm start``` will start the app.  
