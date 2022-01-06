module.exports = (bot) => {
    bot.command('url', ctx => {
        // url
        bot.telegram.sendPhoto(ctx.chat.id, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/M%C3%BCnster%2C_Schlossplatz%2C_Fr%C3%BChjahrssend_--_2019_--_4208.jpg/640px-M%C3%BCnster%2C_Schlossplatz%2C_Fr%C3%BChjahrssend_--_2019_--_4208.jpg")
    })

    bot.command('wikimedia', ctx => {
        // done to force telegram to get a new image each time instead of showing the old cached image
        let r = Math.random().toString(36).substring(2);

        // url
        bot.telegram.sendPhoto(ctx.chat.id, "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Kefermarkt_Kirche_Fl%C3%BCgelaltar_Anbetung_02.jpg/668px-Kefermarkt_Kirche_Fl%C3%BCgelaltar_Anbetung_02.jpg?random=" + r);

        // respond to bot group the with random string used
        bot.telegram.sendMessage(process.env.GROUPID, "Used Url ending: " + r);
    })
}