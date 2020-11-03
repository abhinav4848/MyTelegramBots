require('dotenv').config();

const Telegraf = require('telegraf');
const axios = require('axios');
const fs = require('fs');

const bot = new Telegraf(process.env.TOKEN);

// Record a log as to who said what
bot.use((ctx, next) => {
    // console.log(ctx.from);
    let details = `${ctx.from.first_name} (Username: ${ctx.from.username}, Id: ${ctx.from.id}) `;

    if (ctx.updateSubTypes[0] == "text") {
        bot.telegram.sendMessage(-491960901, details + "said: " + ctx.message.text);
    } else {
        bot.telegram.sendMessage(-491960901, details + "sent: " + ctx.updateSubTypes[0]);
    }

    next();
})

function helpMessage(name) {
    return `*Simple api bot*
/help- command reference
/fortune - get a fortune cookie quote
/cat - get a random cat pic
/cat \`Hello ${name}\` - Get a cat pic with the text
/dogbreeds - Get a list of dog breeds
/dog \`<breed>\` - get a pic of that breed of dog`
};

bot.command(['start', 'help'], ctx => {
    ctx.reply(`Hi ${ctx.from.first_name}, I am Abhinav's api bot. Here are the commands you can give me.`);
    // ctx.reply(helpMessage); // can't use for interesting stuff like markdown formatting
    bot.telegram.sendMessage(ctx.from.id, helpMessage(ctx.from.first_name), {
        parse_mode: "markdown"
    })
})

bot.command('fortune', ctx => {
    axios.get('http://yerkee.com/api/fortune')
        .then(res => {
            ctx.reply(res.data.fortune);
        }).catch(e => {
            console.log(e)
        })
})

bot.command('cat', async (ctx) => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");


    if (inputArray.length == 1) {
        try {
            let res = await axios.get('http://aws.random.cat/meow')
            ctx.replyWithPhoto(res.data.file);
        } catch (err) {
            console.log(err)
        }
    } else {
        inputArray.shift();
        input = inputArray.join(" ");

        // randomness added to force telegram to get a new image each time instead of showing the old cached image
        // useful when input is the same as before
        let r = Math.random().toString(36).substring(2);
        ctx.replyWithPhoto(`https://cataas.com/cat/says/${input}?size=50&color=yellow&r=${r}`);

    }
})

bot.command('dogbreeds', ctx => {
    let rawdata = fs.readFileSync("./dogbreeds.json", "utf8");
    let data = JSON.parse(rawdata);

    let message = "Dog Breeds: \n";
    data.forEach(item => {
        message += `-${item}\n`;
    })

    ctx.reply(message);
})

bot.command("dog", (ctx) => {
    let input = ctx.message.text.split(" ");
    if (input.length != 2) {
        ctx.reply("You must give a dog breed as the second argument");
        return;
    }

    let breedInput = input[1];

    let rawdata = fs.readFileSync("./dogbreeds.json", "utf8");
    let data = JSON.parse(rawdata);

    if (data.includes(breedInput)) {
        axios.get(`https://dog.ceo/api/breed/${breedInput}/images/random`)
            .then(res => {
                ctx.replyWithPhoto(res.data.message)
            }).catch(e => {
                console.log(e);
            })
    } else {
        let suggestions = data.filter(item => {
            return item.startsWith(breedInput);
        })

        if (suggestions.length == 0) {
            ctx.reply("Can't find breed");
        } else {
            let message = `Did you mean:\n`;

            suggestions.forEach(item => {
                message += `-${item}\n`;
            })
            ctx.reply(message);
        }


    }
})

bot.launch();