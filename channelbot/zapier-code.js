// this is wrapped in an `async` function
// you can use await throughout the function
let newDescription = inputData.description.replace("\n(Feed generated with FetchRSS )", "")

let message = `
Title:
${inputData.title}

Description:
${newDescription}
------
<a href="${inputData.link}">Source</a>
`;


let token = "<token>";

let data = {
    chat_id: 'chat id',
    text: message,
    parse_mode: "HTML",
    reply_markup: {
        inline_keyboard: [
            [
                { text: "Go to Post", url: inputData.link }
            ]
        ]
    }
};
await fetch(`https://api.telegram.org/bot${token}/sendMessage`,
    {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
output = [{ id: 123, hello: "world" }];