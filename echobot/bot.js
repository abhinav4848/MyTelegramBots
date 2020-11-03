require('dotenv').config();
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

const helpMessage = `
Say Something to me 
/start - start the bot
/help- command reference
/echo- say "You said echo"
/echo <msg> - echo a message
`;

// Record a log as to who said what
bot.use((ctx, next) => {
    // console.log(ctx.chat);
    if (ctx.updateSubTypes[0] == "text") {
        bot.telegram.sendMessage(-491960901, ctx.from.first_name + " (" + ctx.from.username + ") said: " + ctx.message.text);
    } else {
        bot.telegram.sendMessage(-491960901, ctx.from.first_name + " (" + ctx.from.username + ") sent: " + ctx.updateSubTypes[0]);
    }

    next();
})

bot.start((ctx) => {
    ctx.reply("Hi, I am Echo Bot");
    ctx.reply(helpMessage);
})

bot.help((ctx) => {
    ctx.reply(helpMessage);
})

bot.command("echo", (ctx) => {
    // console.log(ctx);
    let input = ctx.message.text;

    let inputArray = input.split(" ");
    // console.log(inputArray);

    let message = "";

    if (inputArray.length == 1) {
        message = "You said echo";
    } else {
        inputArray.shift(); //removes 1st item from array
        message = inputArray.join(" "); //forms string from array
    }

    ctx.reply(message);
})

bot.launch();

