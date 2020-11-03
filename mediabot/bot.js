require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

// bot.on('message', ctx => {
//     console.log(ctx.message.photo);
// })

// Record a log as to who said what
bot.use((ctx, next) => {
    // console.log(ctx.from);
    let details = `${ctx.from.first_name} (Username: ${ctx.from.username}, Id: ${ctx.from.id}) `;

    if (ctx.updateSubTypes[0] == "text") {
        bot.telegram.sendMessage(-491960901, details + "said: " + ctx.message.text);
    } else {
        bot.telegram.sendMessage(-491960901, details + "sent: " + ctx.updateSubTypes[0]);
    }

    next();
})

let message = `
/start or /help - Get intro message
/url - Send image from a url
/plab - Get latest plab seats
/pcpath - Send image from path on the pc
/newyork - get image of new york
/dubai - get gif of Dubai
/delhi- get location of New Delhi
/cities - Get photos of 5 cities
/citieslist - Get text file of all cities

Other
- Send an image or document to get a download link if less than 20mb (file) or 5mb (image)`;

bot.command(['start', 'help'], ctx => {
    ctx.reply(message);
})

/**
 * Sending Media
 * https://telegraf.js.org/#/?id=sendphoto
 * 
 * https://telegraf.js.org/#/?id=working-with-files
 */

bot.command('url', ctx => {
    // url
    bot.telegram.sendPhoto(ctx.chat.id, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/M%C3%BCnster%2C_Schlossplatz%2C_Fr%C3%BChjahrssend_--_2019_--_4208.jpg/640px-M%C3%BCnster%2C_Schlossplatz%2C_Fr%C3%BChjahrssend_--_2019_--_4208.jpg")
})

bot.command('plab', ctx => {
    // done to force telegram to get a new image each time instead of showing the old cached image
    let r = Math.random().toString(36).substring(2);

    // url
    bot.telegram.sendPhoto(ctx.chat.id, "https://plabdate.blob.core.windows.net/latest/plabdateml.png?v=" + r);

    // respond to bot group the with random string used
    bot.telegram.sendMessage(-491960901, "Used Url ending: " + r);
})

// Send file from PC
bot.command('pcpath', ctx => {
    //file path
    bot.telegram.sendPhoto(ctx.chat.id, {
        source: "res/london.jpg"
    })
})

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

// reply to a message by making it a context using 'extra' parameter
// also use chat action: https://core.telegram.org/bots/api#sendchataction
bot.command('newyork', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")

    bot.telegram.sendPhoto(ctx.chat.id,
        {
            source: 'res/newyork.jpg'
        },
        {
            reply_to_message_id: ctx.message.message_id
        })
})

// Dubai send as gif
// https://core.telegram.org/bots/api#sendanimation
// https://telegraf.js.org/#/?id=sendanimation
bot.command('dubai', ctx => {
    bot.telegram.sendChatAction(ctx.chat.id, "upload_video")

    bot.telegram.sendAnimation(ctx.chat.id, "https://media2.giphy.com/media/c0BdI069vyn5K/giphy.gif?cid=790b7611640372d3186cd2314995cb37839375a907f0a08e&rid=giphy.gif",
        {
            reply_to_message_id: ctx.message.message_id
        })
})

/**
 * Cities command
 */
//cumbersome method
// bot.command('cities', ctx => {
//     bot.telegram.sendMediaGroup(ctx.chat.id,
//         [
//             {
//                 type: 'photo', media: { source: 'res/dubai.jpg' }
//             },
//             {
//                 type: 'photo', media: { source: 'res/newyork.jpg' }
//             },
//             {
//                 type: 'photo', media: { source: 'res/singapore.jpg' }
//             }
//         ],
//         {
//             reply_to_message_id: ctx.message.message_id
//         })
// })

//simpler method
bot.command('cities', ctx => {
    //chat action
    bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")

    //avoid code repetition
    let cities = ['res/dubai.jpg', 'res/hongkong.jpg', 'res/london.jpg', 'res/newyork.jpg', 'res/singapore.jpg'];

    let result = cities.map(city => {
        return {
            type: 'photo',
            media: {
                source: city
            }
        }
    })

    // send final album
    bot.telegram.sendMediaGroup(ctx.chat.id, result,
        {
            reply_to_message_id: ctx.message.message_id
        })
});

// Send list of cities as a text file from pc, and also give a nice thumbnail to it
bot.command('citieslist', ctx => {
    bot.telegram.sendDocument(ctx.chat.id,
        {
            source: "res/citieslist.txt"
        },
        {
            thumb: {
                source: "res/dubai.jpg"
            }
        })
})

// Send location of delhi
bot.command('delhi', ctx => {
    bot.telegram.sendLocation(ctx.chat.id, 28.633092, 77.220562)
})

/**
 * Get a download link for any file sent
 */
bot.on('message', async ctx => {
    if (ctx.updateSubTypes[0] == 'document') {
        try {
            let link = await bot.telegram.getFileLink(ctx.message.document.file_id);
            ctx.reply("Your download link: " + link);
        } catch (err) {
            console.log(err);
            ctx.reply(err.description)
        }
    } else if (ctx.updateSubTypes[0] == 'photo') {
        try {
            let link = await bot.telegram.getFileLink(ctx.message.photo[2].file_id);
            ctx.reply("Your download link: " + link);
        } catch (err) {
            console.log(err);
            ctx.reply(err.description)
        }

        // respond with the same photo they sent
        bot.telegram.sendPhoto(ctx.chat.id, ctx.message.photo[2].file_id);
    }
})

bot.launch();