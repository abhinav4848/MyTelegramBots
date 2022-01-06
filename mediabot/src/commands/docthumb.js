module.exports = (bot) => {
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
}