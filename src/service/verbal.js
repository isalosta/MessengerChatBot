
let Question = {
    "0" : {
        "text": "What is Your Name ?"
    },
    "1" : {
        "text": "Please tell me when is you were born (DD/MM/YYYY) ?"
    }, 
    "2" : {
        "text": "Do you want to know About your day of your birthday ?"
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

exports.Question = Question;
exports.EndResponse = EndResponse;
