
'use strict';

// Close dialog with the customer, reporting fulfillmentState of Failed or Fulfilled ("Thanks, your pizza will arrive in 20 minutes")
function close(sessionAttributes, intentName,  fulfillmentState, message) {
    return {
        sessionAttributes,
        intentName:intentName,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
            "responseCard": {

                "contentType": "application/vnd.amazonaws.card.generic",
                "genericAttachments": [
                    {
                        "title":"Your booked Car",
                        "subTitle":"Your Booked title",
                        "imageUrl":"https://www.autoblog.com/img/research/styles/photos/performance.jpg",
                        "attachmentLinkUrl":"https://www.autoblog.com/img/research/styles/photos/performance.jpg",
                        "buttons":[
                            {
                                "text":"button-text",
                                "value":"Value sent to server on button click"
                            }
                        ]

                    },

                ]
            }
        },
    };
}

function delegate(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function elicitSlot(sessionAttributes,slotName ,fulfillmentState, message) {
    return {
        sessionAttributes,
        "slotToElicit":slotName,
        dialogAction: {
            type: 'ElicitSlot',
        },
        "slots":{
            "City":null
        }
    };
}



function confirmIntent(sessionAttributes, intentName, slots, message) {
    return {
        'sessionAttributes': sessionAttributes,
        'dialogAction': {
            'type': 'ConfirmIntent',
            'intentName': intentName,
            'slots': slots,
            'message': message
        }
    }
}





// --------------- Events -----------------------

function dispatch(intentRequest, callback) {
    console.log(intentRequest);


    let sessionAttributes = intentRequest.sessionAttributes;
    let slots = intentRequest.currentIntent.slots;

    // sessionAttributes['carBook'] = true;

    if (intentRequest.currentIntent.name === 'CarIntent') {

        sessionAttributes['carBook'] = true;

        if (sessionAttributes['carBook'] && sessionAttributes['hotelBook'] ){

            callback(close(sessionAttributes, intentRequest.currentIntent.name, 'Fulfilled',
                {'contentType': 'PlainText', 'content': `Your Car and Hotel is booked`}));

        }
        else   {

            callback(confirmIntent(
                sessionAttributes,
                'HotelIntent',
                {
                    "City":null,
                    "CheckInDate":null,
                    "CheckInTime": null,
                    "Days": null,
                    "RoomType": null
                },
                {'contentType': 'PlainText', 'content': `Do you also like to book a hotel?`}));
        }

    }
    if (intentRequest.currentIntent.name === 'HotelIntent') {

        sessionAttributes['hotelBook'] = true;

        if (sessionAttributes['carBook'] && sessionAttributes['hotelBook'] ){

            callback(close(sessionAttributes, intentRequest.currentIntent.name, 'Fulfilled',
                {'contentType': 'PlainText', 'content': `Your Car and Hotel is booked`}));

        }
        else   {

            callback(confirmIntent(
                sessionAttributes,
                'CarIntent',
                {
                    "CarDate":null,
                    "CarTypes":null,
                    "CarCity": null,
                },
                {'contentType': 'PlainText', 'content': `Do you also like to rent a Car?`}));
        }

    }

    // callback(close(sessionAttributes, 'Fulfilled',
    //     {'contentType': 'PlainText', 'content': `Okay, Today is cloudy in ${city} and temperature is ${temperature}`}));

}

// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        dispatch(event,
            (response) => {
                callback(null, response);
            });
    } catch (err) {
        callback(err);
    }
};