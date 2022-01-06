require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

// bot.on('message', ctx => {
//     console.log(ctx.message.photo);
// })

const chatlogger = require('./src/middleware/chatlogger');
chatlogger(bot);

const startCommand = require('./src/commands/start');
startCommand(bot);

/**
 * Sending Media
 * https://telegraf.js.org/#/?id=sendphoto
 * 
 * https://telegraf.js.org/#/?id=working-with-files
 */

const mediaByURL = require('./src/commands/mediaByURL');
mediaByURL(bot);

const mediaByPC = require('./src/commands/mediaByPC');
mediaByPC(bot);


/**
 * file id:
 * first send a file to telegram bot, then get its file id via:  
 * bot.on('message', ctx => {
 * console.log(ctx.message.photo[2].file_id);
 * })
 * then send that file id
 * 
*/
// bot.telegram.sendPhoto(ctx.chat.id, ctx.message.photo[2].file_id)
// });

// Dubai send as gif
const gifByPC = require('./src/commands/gifByPC');
gifByPC(bot);

// Send Media group
const mediaGroup = require('./src/commands/mediaGroup');
mediaGroup(bot);

// document with thumbnail
const docthumb = require('./src/commands/docthumb');
docthumb(bot);

// Send location of delhi
const location = require('./src/commands/location');
location(bot);

/**
 * Get a download link for any file sent
 */
const downloader = require('./src/middleware/downloader.js');
downloader(bot);

bot.launch();