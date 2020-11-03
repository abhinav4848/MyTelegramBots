/**
 * Make a channel, add this bot
 * go to fetchrss and enter a link. 
 * Copy the output link and go to zapier.
 * Make a zap, choose trigger as rss, and action as code
 * Paste the code from zapier-code.js
 * 
 * Run this page code however by `node bot.js`
 * it just sends 'test' to the channel
 */
// const Telegraf = require('telegraf');

// const bot = new Telegraf(process.env.TOKEN);

// bot.use(ctx => {
//     console.log(ctx.chat);
// })

require('dotenv').config();
const fetch = require('node-fetch');

let token = process.env.TOKEN;

let message = `
<b>Title</b>:
---
<i>Description:</i>
`;

let data = {
    chat_id: '-1001303834031', //-1001303834031
    text: message,
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Go to Post", url: "http://abhinavkr.com" }
            ]
        ]
    }
};

(async () => {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
})();

