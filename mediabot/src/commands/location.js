module.exports = (bot) => {
    bot.command('delhi', ctx => {
        bot.telegram.sendLocation(ctx.chat.id, 28.633092, 77.220562)
    })
}