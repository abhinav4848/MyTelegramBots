module.exports = (bot) => {
    // Record a log as to who said what
    bot.use((ctx, next) => {
        // console.log(ctx.from);
        let details = `${ctx.from.first_name} (Username: ${ctx.from.username}, Id: ${ctx.from.id}) `;

        if (ctx.updateSubTypes[0] == "text") {
            bot.telegram.sendMessage(process.env.GROUPID, details + "said: " + ctx.message.text);
        } else {
            bot.telegram.sendMessage(process.env.GROUPID, details + "sent: " + ctx.updateSubTypes[0]);
        }

        next();
    })
}