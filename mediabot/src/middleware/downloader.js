module.exports = (bot) => {
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
}