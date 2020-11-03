require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

const axios = require('axios');

bot.command('test', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, 'Main Menu', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'See Fruits List', callback_data: 'fruits' },
                ],
                [
                    { text: 'See Meats List', callback_data: 'meats' }
                ]
            ]
        }
    })
})

// bot.action('one', ctx => {
//     ctx.answerCbQuery('Thanks for the click');
//     ctx.reply('You clicked the button');
// })


bot.action('fruits', ctx => {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'List of Fruits:\n-Apples\n-Oranges\n-Pears', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Menu', callback_data: 'menu' },
                ]
            ]
        }
    })
})

bot.action('menu', ctx => {
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, 'Main Menu', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'See Fruits List', callback_data: 'fruits' },
                ],
                [
                    { text: 'See Meats List', callback_data: 'meats' }
                ]
            ]
        }
    })
})

bot.launch();