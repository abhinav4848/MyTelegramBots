require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

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

bot.on('message', ctx => {
    console.log(ctx.from)

    // console.log(ctx.updateSubTypes)
    // Gifs: [ 'animation', 'document', 'forward' ]
    // Others: [ 'video', 'forward' ]
    if (ctx.updateSubTypes[1] == 'forward' || ctx.updateSubTypes[2] == 'forward') {

        // Get the right link to put in media caption
        let link;

        try {
            // for normal group links
            link = `https://t.me/c/${ctx.message.forward_from_chat.id.toString().substring(4)}/${ctx.message.forward_from_message_id}`;
        } catch {
            try {
                // for bot messages you forwarded from a private chat
                link = `Bot with Name: ${ctx.message.forward_from.first_name} (@${ctx.message.forward_from.username})`;
            } catch {
                // Sometimes, "forward_from_chat" or "forward_from" doesn't even exist. Eg: when account is hidden by user
                link = `No original address specified. Sender was @${ctx.message.forward_sender_name}`;
            }
        }

        if (ctx.updateSubTypes[0] == 'photo') {
            // Get the last array index which is always the highest file size.
            // Mostly, it's [2], but sometimes it's [1]
            let file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id;

            bot.telegram.sendPhoto(ctx.chat.id, file_id, {
                caption: 'Sent from ' + link
            });
        } else if (ctx.updateSubTypes[0] == 'video') {
            bot.telegram.sendVideo(ctx.chat.id, ctx.message.video.file_id, {
                caption: 'Sent from ' + link
            });
        } else if (ctx.updateSubTypes[0] == 'animation') {
            bot.telegram.sendAnimation(ctx.chat.id, ctx.message.animation.file_id, {
                caption: 'Sent from ' + link
            });
        } else {
            bot.telegram.sendMessage(ctx.chat.id, "Not a Pic/Vid/Gif",
                {
                    reply_to_message_id: ctx.message.message_id
                });
            // By returning, we terminate the function and prevent further execution of code inside it
            return;
        }

        // delete the original message the user sent
        // bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
        ctx.deleteMessage();
    } else {
        if (ctx.message.chat.type != 'supergroup') {
            // dont send this message in group
            bot.telegram.sendMessage(ctx.chat.id, "Not a forwarded message",
                {
                    reply_to_message_id: ctx.message.message_id
                });
        }
    }
})

bot.launch();