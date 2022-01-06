module.exports = (bot) => {
    let message = `
/start or /help - Get intro message
/url - Send image from a url
/wikimedia - Get a new copy of a wikimedia image
/pc - Send image from path on the pc
/newyork - get image of new york
/dubai - get gif of Dubai
/delhi- get location of New Delhi
/cities - Get photos of 5 cities
/citieslist - Get text file of all cities

Other
- Send an image or document to get a download link if less than 20mb (file) or 5mb (image)`;

    bot.command(['start', 'help'], ctx => {
        ctx.reply(message);
    })
}