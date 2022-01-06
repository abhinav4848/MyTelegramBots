module.exports = (bot) => {
    //cumbersome method
    // bot.command('cities', ctx => {
    //     bot.telegram.sendMediaGroup(ctx.chat.id,
    //         [
    //             {
    //                 type: 'photo', media: { source: 'res/dubai.jpg' }
    //             },
    //             {
    //                 type: 'photo', media: { source: 'res/newyork.jpg' }
    //             },
    //             {
    //                 type: 'photo', media: { source: 'res/singapore.jpg' }
    //             }
    //         ],
    //         {
    //             reply_to_message_id: ctx.message.message_id
    //         })
    // })

    // simpler method
    bot.command('cities', ctx => {
        //chat action
        bot.telegram.sendChatAction(ctx.chat.id, "upload_photo")

        //avoid code repetition
        let cities = ['res/dubai.jpg', 'res/hongkong.jpg', 'res/london.jpg', 'res/newyork.jpg', 'res/singapore.jpg'];

        let result = cities.map(city => {
            return {
                type: 'photo',
                media: {
                    source: city
                }
            }
        })

        // send final album
        bot.telegram.sendMediaGroup(ctx.chat.id, result,
            {
                reply_to_message_id: ctx.message.message_id
            })
    });
}