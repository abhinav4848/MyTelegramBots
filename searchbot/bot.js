require('dotenv').config();
const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.TOKEN);

const startCommand = require('./src/commands/start');
startCommand(bot);

const imageHandler = require('./src/inlinehandlers/image');
imageHandler(bot, axios);

const wikiHandler = require('./src/inlinehandlers/wiki');
wikiHandler(bot, axios);

const startHandler = require('./src/inlinehandlers/start');
startHandler(bot);

bot.launch();