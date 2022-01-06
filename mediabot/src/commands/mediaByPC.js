module.exports = (bot) => {
    // Send file from PC
    bot.command('pc', ctx => {
        //file path
        bot.telegram.sendPhoto(ctx.chat.id, {
            source: "res/london.jpg"
        })
    })

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

}