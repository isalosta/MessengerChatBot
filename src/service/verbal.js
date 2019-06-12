
let Question = {
    "0" : {
        "text": "What is Your Name ?"
    },
    "1" : {
        "text": "Please tell me when is you were born ?"
    }
}

let EndResponse = (date = "") => {
    return {
        "n": {
            "text": "Goodbye! :)"
        },
        "y": {
            "text": `There are ${date} days left until your next birthday`
        }
    }
}

exports = {
    Question,
    EndResponse
}