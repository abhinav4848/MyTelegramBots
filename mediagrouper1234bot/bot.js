require('dotenv').config();
const { Telegraf } = require('telegraf')
const { DateTime } = require("luxon");

const bot = new Telegraf(process.env.TOKEN);

// https://api.telegram.org/bot<bot token>/getUpdates

// Add the bot to a group and send /groupid@mediacleanerbot
// copy that value and paste it in the .env to enable logging
bot.command('groupid', ctx => {
    ctx.reply(ctx.chat.id)
})

// Record a log as to who said/sent what
// bot.use((ctx, next) => {
//     let details = `${ctx.from.first_name} (@${ctx.from.username})`;

//     if (ctx.updateSubTypes[0] == "text") {
//         // General message if text
//         bot.telegram.sendMessage(process.env.GROUP_ID, `${details} said: ${ctx.message.text}`);
//     } else {
//         try {
//             // Send the msg source as an html formatted link
//             let link = `https://t.me/c/${ctx.message.forward_from_chat.id.toString().substring(4)}/${ctx.message.forward_from_message_id}`;
//             let message = `${details} sent <a href="${link}">${ctx.updateSubTypes[0]}</a>`;

//             bot.telegram.sendMessage(process.env.GROUP_ID, message, {
//                 parse_mode: "html"
//             })
//         } catch {
//             bot.telegram.sendMessage(process.env.GROUP_ID, `${details} sent: ${ctx.updateSubTypes[0]}`);
//         }
//     }

//     next();
// })

// intro help
bot.command(['start', 'help'], ctx => {
    let welcome = `Send me a media file to get the ID of the file`;

    bot.telegram.sendMessage(ctx.from.id, welcome, {
        parse_mode: "markdown"
    })
})

// reply with a mediagroup
bot.command('group', ctx => {
    bot.telegram.sendMediaGroup(ctx.chat.id,
        [
            {
                type: 'photo', media: 'AgACAgUAAxkBAAPnYZAUGDpTqK_DNpV8nb6dBIE1T7MAAuGsMRsYWHlUPkiRMH621CoBAAMCAAN5AAMiBA'
            },
            {
                type: 'video', media: 'BAACAgUAAxkBAAPpYZAUPaskSup9r2GOZWB_-lEgrNEAAlgDAAKQCRlUQr8qAruWTPoiBA'
            }
        ],
        {
            reply_to_message_id: ctx.message.message_id
        })
})

// respond to any msg with this: 
bot.on('message', ctx => {
    // console.log(ctx.message)

    // console.log(ctx.updateSubTypes)
    // Gifs: [ 'animation', 'document', 'forward' ]
    // Others: [ 'video', 'forward' ]
    // if (ctx.updateSubTypes[1] == 'forward' || ctx.updateSubTypes[2] == 'forward') {

    // Get the right link to put in media caption
    let link;

    try {
        // for normal group links
        link = `https://t.me/c/${ctx.message.forward_from_chat.id.toString().substring(4)}/${ctx.message.forward_from_message_id}`;
    } catch {
        try {
            // for messages forwarded from a private chat
            link = `User/Bot with Name: ${ctx.message.forward_from.first_name} (@${ctx.message.forward_from.username})`;
        } catch {
            // Sometimes, "forward_from_chat" or "forward_from" doesn't even exist. Eg: when account is hidden by user
            link = `No original address specified. Sender was @${ctx.message.forward_sender_name}`;
        }
    }

    // based on type of file sent, we read the json object of it differently
    if (ctx.updateSubTypes[0] == 'photo') {
        // Get the last array index which is always the highest file size.
        // Mostly, it's [2], but sometimes it's [1]
        // Actually size doesn't matter to hardcode the array index at all 
        let file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        bot.telegram.sendPhoto(ctx.chat.id, file_id, {
            caption: 'Sent from ' + link + ',\n\nFile ID: `' + file_id + '`',
            parse_mode: "markdown"
        });

        // delete the original message the user sent
        // bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        ctx.deleteMessage();

    } else if (ctx.updateSubTypes[0] == 'video') {
        // Only enabled file naming for videos

        if (ctx.message.video.file_name) {
            nameOfMedia = ctx.message.video.file_name
        } else {
            // https://moment.github.io/luxon/docs/manual/formatting.html
            //convert to milliseconds
            const unixTimestamp = ctx.message.date * 1000;
            //Telegram style: 18-03-2021_22-37-33
            nameOfMedia = 'video_xxx@' + DateTime.fromMillis(unixTimestamp).toFormat("dd'-'MM'-'y'_'HH'-'mm'-'ss'")
        }

        bot.telegram.sendVideo(ctx.chat.id, ctx.message.video.file_id,
            {
                caption: 'Sent from ' + link + ',\n\nFilename: `' + nameOfMedia + '`,\n\nFile ID: `' + ctx.message.video.file_id + '`',
                parse_mode: "markdown"
            }
        );

        ctx.deleteMessage();
    } else if (ctx.updateSubTypes[0] == 'animation') {
        bot.telegram.sendAnimation(ctx.chat.id, ctx.message.animation.file_id, {
            caption: 'Sent from ' + link + ',\n\nFile ID: `' + ctx.message.animation.file_id + '`'
        });

        ctx.deleteMessage();
    } else {
        if (ctx.message.chat.type == 'private') {
            bot.telegram.sendMessage(ctx.chat.id, "Not a Pic/Vid/Gif.",
                {
                    reply_to_message_id: ctx.message.message_id
                }
            );
            // By returning, we terminate the function and prevent further execution of code inside it
            return;
        }
    }
    // } else {
    //     if (ctx.message.chat.type == 'private') {
    //         // dont send this message in group
    //         bot.telegram.sendMessage(ctx.chat.id, "Not a forwarded message",
    //             {
    //                 reply_to_message_id: ctx.message.message_id
    //             });
    //     }
    // }
})

bot.launch();