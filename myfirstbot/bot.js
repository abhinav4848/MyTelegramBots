require('dotenv').config();

const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);

/**
 * Slash based commands
 */
// catch the particular method (start, help, settings) method
// ctx is Telegraf context

// bot.start((ctx) => {
//     ctx.reply(`${ctx.from.first_name} has entered the start command and its type is ${ctx.updateSubTypes[0]}`);
//     // console.log(ctx);
//     // console.log(ctx.from);
//     // console.log(ctx.chat);
//     // console.log(ctx.message);
//     // console.log(ctx.updateSubTypes);
// });

// bot.help((ctx) => {
//     ctx.reply("You entered the help command");
// })

// bot.settings((ctx) => {
//     ctx.reply("You entered the settings command");
// })

// // custom commands
// bot.command(["test", "Test"], (ctx) => {
//     ctx.reply("Hello world");
// })

/**
 * Normal messages
 * Work only if no other piece of text
 */
// bot.hears(["cat", "Cat"], (ctx) => {
//     ctx.reply("Meow!");
// })

/**
 * MIDDLEWARES
 * https://telegraf.js.org/#/?id=on
 * https://telegraf.js.org/#/?id=update-types
 * 
 * Use the next command to pass function on from one middleware to next otherwise it'll end at the earliest middleware it finds. https://telegraf.js.org/#/?id=middleware
 * Also, pass ctx in the next() to allow the modified context to be passed on further downstream
 */
// bot.on("text", (ctx, next) => {
//     ctx.reply("This is a text msg");
//     next(ctx);
// })

// bot.on("sticker", (ctx, next) => {
//     ctx.reply("This is a sticker");
//     next(ctx);
// })

/**
 * OTHER METHODS:
 * They work even in middle of a long speech of text
 * Mention: https://telegraf.js.org/#/?id=mention
 * Phone: https://telegraf.js.org/#/?id=phone
 * Hashtag: https://telegraf.js.org/#/?id=hashtag
 * 
 * work only on the very specific text you put as first parameter
 */

// bot.mention("botfather", (ctx) => {
//     ctx.reply('mention method');
// })

// bot.phone("+1 730 263-4233", (ctx) => {
//     ctx.reply('phone method');
// })

// bot.hashtag("hash", (ctx) => {
//     ctx.reply('hashtag method');
// })

/** 
 * Bot Use method
 * As well as modifying the state
 * then passing on the modified ctx to the next middleware downstream
 */

// bot.use((ctx, next) => {
//     ctx.state.apple = 5;
//     // console.log(ctx);
//     ctx.reply("You used the bot");
//     next(ctx);
// })

// bot.start((ctx) => {
//     ctx.reply(ctx.state.apple);
// })

/** 
 * Benefit of using telegraf wrapper
 */
//ctx shortcuts vs Standard telegram methods
// bot.command('start', ctx => {
//     //ctx.reply(text, [extra]);
//     ctx.reply("Hello World"); //ctx method shortcuts does not require chatId
//     //bot.telegram.sendMessage(chatId, text, [extra])
//     // bot.telegram.sendMessage(ctx, chat.id, "hellow World"); //telegram method requires chatId
// })

//when using extra params https://telegraf.js.org/#/?id=sendmessage
bot.command('start', ctx => {
    //bot.telegram.sendMessage(chatId, text, [extra])
    // bot.telegram.sendMessage(ctx.chatId, "Hello World",
    //     {
    //         parse_mode: 'Markdown',
    //         disable_notification: true
    //     });

    //ctx.reply(text, [extra])
    ctx.reply("Hello World",
        {
            parse_mode: 'Markdown',
            disable_notification: true
        }
    );
})

bot.launch();