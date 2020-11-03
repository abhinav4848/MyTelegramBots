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
    console.log(ctx.updateSubTypes)
    if (ctx.updateSubTypes[1] == 'forward' || ctx.updateSubTypes[2] == 'forward') {
        let link = "https://t.me/c/" + ctx.message.forward_from_chat.id.toString().substring(4) + "/" + ctx.message.forward_from_message_id;

        if (ctx.updateSubTypes[0] == 'photo') {
            bot.telegram.sendPhoto(ctx.chat.id, ctx.message.photo[2].file_id, {
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