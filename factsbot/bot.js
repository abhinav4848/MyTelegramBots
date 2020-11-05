require('dotenv').config();
const axios = require('axios');
const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

/**
 * Even if we don't mention variables here and directly declare them in function without let/var,
 * they'll have the global scope and work outside as well
 * Don't know which is the right way to do it
 */
// declare an array which will hold all quotes
let dataStore = [];
// will hold the maximum rows value returned from getter function which is called by getData() function
let maxRows;

// run this function to populate the dataStore array which is in global space
getData();

/**
 * Intro Messages
 */
bot.command(['start', 'help'], ctx => {
    let welcome = `
/start or /help - Get welcome message
/quote: Get a random quote
/quote \`<number>\`: Choose a number between 1 & ${maxRows}
/update: Fetch quotes list again

Currently there are ${maxRows} quotes available`;

    bot.telegram.sendMessage(ctx.from.id, welcome, {
        parse_mode: "markdown"
    })
})

/**
 * /quote: Return a random quote from 1 to maxRow
 * /quote 42: return that number quote
 */
bot.command('quote', ctx => {
    let input = ctx.message.text;
    let inputArray = input.split(" ");
    let quote;

    // if array has only one param, return random quote, 
    // else see if the [1] place is a valid number and return the specific quote
    // otherwise inform about valid rules and exit function
    if (inputArray.length == 1) {

        let k = Math.floor(Math.random() * maxRows) + 1;
        console.log("Quote #" + k);

        quote = dataStore.filter(item => {
            return (item.row == k && item.col == '5');
        })[0];

    } else {

        // Convert the inputArray[1] to an integer for eval
        let number = parseInt(inputArray[1]);

        if (!isNaN(number) && number >= 1 && number <= maxRows) {
            quote = dataStore.filter(item => {
                return (item.row == number && item.col == '5');
            })[0];
            console.log("Chosen Quote #" + number);

        } else {

            ctx.reply(`Choose number between 1 and ${maxRows} only.`)
            // remember to terminate the function otherwise the messages get thrown after this and cause bugs
            return;

        }
    }

    let message = `
\`Quote #${quote.row}:\`
${quote.val}
`;

    bot.telegram.sendMessage(ctx.from.id, message, {
        parse_mode: "markdown"
    })
})

/**
 * When new quotes are added, run this manually to update the datastore array with fresh data
 */
bot.command('update', async ctx => {
    try {
        await getData();
        ctx.reply('Updated');
    } catch (err) {
        console.log(err);
        ctx.reply('Error Encountered)');
    }
})

/**
 * The actual function to populate the dataStore array
 */
async function getData() {
    try {
        // https://spreadsheets.google.com/feeds/cells/1pkWhpR8hd3MHY85d_WzPPjeDwmIJnIEW_DRQOIaSmts/1/public/full?alt=json
        let res = await axios(process.env.SHEET);
        let data = res.data.feed.entry;

        // Done to empty the array of the previous data which it was populated with after the first getData() operation
        dataStore = [];

        data.forEach(item => {
            dataStore.push({
                row: item.gs$cell.row,
                col: item.gs$cell.col,
                val: item.gs$cell.inputValue
            })
        })

        // assign value to the maxRows variable mentioned at the top
        // I declared it here so it runs only after dataStore has been populated
        // Otherwise if put outside, it was running sooner
        // and so dataStore being emoty, .filter() wouldn't work
        maxRows = dataStore.filter(item => {
            return (item.row == '1' && item.col == '2');
        })[0].val;

        // console.log(dataStore);

        // Output:
        // {
        //     row: '3',
        //     col: '5',
        //     val: 'Awesome Quotation'
        // },

    } catch (err) {
        console.log(err);
        throw new Error;
    }
}

bot.launch();
