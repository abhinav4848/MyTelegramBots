module.exports = (bot) => {
    // https://core.telegram.org/bots/api#sendanimation
    // https://telegraf.js.org/#/?id=sendanimation
    bot.command('dubai', ctx => {
        bot.telegram.sendChatAction(ctx.chat.id, "upload_video")

        bot.telegram.sendAnimation(ctx.chat.id, "https://media2.giphy.com/media/c0BdI069vyn5K/giphy.gif?cid=790b7611640372d3186cd2314995cb37839375a907f0a08e&rid=giphy.gif",
            {
                reply_to_message_id: ctx.message.message_id
            })
    })
}