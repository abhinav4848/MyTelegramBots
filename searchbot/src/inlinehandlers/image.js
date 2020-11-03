const apikey = process.env.PIXABAYAPI;
const axios = require('axios');

module.exports = (bot) => {
    // Can't use below method when we want to use diff triggers in a bot
    // bot.on('inline_query', async ctx => {
    // let query = ctx.inlineQuery.query;

    bot.inlineQuery(/p\s.+/, async ctx => {
        // "p iphone 8"
        let input = ctx.inlineQuery.query.split(' '); // ['p', 'iphone', '8']
        input.shift();//['iphone', '8']
        let query = input.join(' '); //"iphone 8"

        let res = await axios.get(`https://pixabay.com/api/?key=${apikey}&q=${query}`);

        let data = res.data.hits;
        // get the aray of all images with full details
        // console.log(data);

        let results = data.map((item, index) => {
            return {
                type: 'photo',
                id: String(index),
                photo_url: item.webformatURL,
                thumb_url: item.previewURL,
                photo_width: 300,
                photo_height: 200,
                caption: `[Large image](${item.largeImageURL})`,
                parse_mode: 'Markdown'
            }
        })
        ctx.answerInlineQuery(results);
    })

}