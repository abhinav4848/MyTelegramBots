const config = require('../../config');

module.exports = (bot) => {
    // handler for /start and /help
    bot.command(['start', 'help'], ctx => {
        // Set Welcome Message
        let message = config.helpMessage;

        ctx.reply(message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Search Pixabay Image', switch_inline_query_current_chat: 'p ' }
                    ],
                    [
                        { text: 'Search Wikipedia Articles', switch_inline_query_current_chat: 'w ' }
                    ]
                ]
            }
        })
    })
}