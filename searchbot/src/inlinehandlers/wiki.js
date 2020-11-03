const axios = require('axios');

module.exports = (bot) => {
    bot.inlineQuery(/w\s.+/, async ctx => {
        // "w iphone 8"
        let input = ctx.inlineQuery.query.split(' '); // ['w', 'iphone', '8']
        input.shift();//['iphone', '8']
        let query = input.join(' '); //"iphone 8"

        let res = await axios.get(`https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=${query}&limit=50`)
        let data = res.data;

        let allTitles = data[1];
        let allLinks = data[3];

        if (allTitles == undefined) {
            return;
        }

        let results = allTitles.map((item, index) => {
            // item means title cuz we looping over titles only
            return {
                type: 'article',
                id: String(index),
                title: item,
                input_message_content: {
                    message_text: `${item}\n${allLinks[index]}`
                },
                description: allLinks[index],
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: `Share "${item}"`, switch_inline_query: `w ${item}` }
                        ]
                    ]
                }
            }
        })
        ctx.answerInlineQuery(results);
    })

}