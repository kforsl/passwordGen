const capitalLetterArray = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",];
const lowerLetterArray = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",];
const numbersArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const symbolsArray = ["!","@","#","$","%","^","&","*","(",")","_","-","+","=","{","}","[","]","|",":",";","'","<",">",",",".","?","/","~",];
const availibleCharacters = [];

exports.handler = async (event) => {
    const { path, method } = event.requestContext.http;

    let response = generateResponse(400, "Not Found!");

    if (path === "/password" && method === "GET") {
        const {
            length,
            checkCapital,
            checkLower,
            checkNumbers,
            checkSymbols,
            error,
        } = getQueryStringParameters(event);

        if (error.length > 0) {
            response = generateResponse(400, error);
        } else {
            if (length >= 8) {
                let generatedPassword = "";
                while (
                    !isAllChecksValid(
                        generatedPassword,
                        checkCapital,
                        checkLower,
                        checkNumbers,
                        checkSymbols
                    )
                ) {
                    generatedPassword = generatePassword(length);
                }

                response = generateResponse(
                    200,
                    "New Password generated.",
                    generatedPassword
                );
            } else {
                response = generateResponse(
                    400,
                    "Password minimum length is 8"
                );
            }
        }
    }
    return response;
};

function generateResponse(status, messageText, password) {
    return {
        statusCode: status,
        body: JSON.stringify({
            message: messageText,
            password: password ? password : "not generated",
        }),
    };
}

function getQueryStringParameters(event) {
    let length = 30;
    let checkCapital = false;
    let checkLower = false;
    let checkNumbers = false;
    let checkSymbols = false;
    let error = "";

    if (event.hasOwnProperty("queryStringParameters")) {
        if (event.queryStringParameters.hasOwnProperty("length"))
            length = event.queryStringParameters.length;
        if (!parseInt(length)) {
            error += length + " is not a valid length, ";
        }

        if (event.queryStringParameters.hasOwnProperty("capital")) {
            let checkCapitalInput = event.queryStringParameters.capital;
            if (checkCapitalInput === "true") {
                checkCapital = true;
                availibleCharacters.push(...capitalLetterArray);
            } else if (checkCapitalInput === "false") {
                checkCapital = false;
            } else {
                console.log("error");

                error +=
                    "Capital need to be true or false. " +
                    checkCapitalInput +
                    " is not valid, ";
            }
        }
        if (event.queryStringParameters.hasOwnProperty("lower")) {
            let checkLowerInput = event.queryStringParameters.lower;
            if (checkLowerInput === "true") {
                checkLower = true;
                availibleCharacters.push(...lowerLetterArray);
            } else if (checkLowerInput === "false") {
                checkLower = false;
            } else {
                error +=
                    "Lower need to be true or false. " +
                    checkLowerInput +
                    " is not valid, ";
            }
        }
        if (event.queryStringParameters.hasOwnProperty("numbers")) {
            let checkNumbersInput = event.queryStringParameters.numbers;
            if (checkNumbersInput === "true") {
                checkNumbers = true;
                availibleCharacters.push(...numbersArray);
            } else if (checkNumbersInput === "false") {
                checkNumbers = false;
            } else {
                error +=
                    "Number need to be true or false. " +
                    checkNumbersInput +
                    " is not valid, ";
            }
        }
        if (event.queryStringParameters.hasOwnProperty("symbols")) {
            let checkSymbolsInput = event.queryStringParameters.symbols;
            if (checkSymbolsInput === "true") {
                checkSymbols = true;
                availibleCharacters.push(...symbolsArray);
            } else if (checkSymbolsInput === "false") {
                checkSymbols = false;
            } else {
                error +=
                    "Symbol need to be true or false. " +
                    checkSymbolsInput +
                    " is not valid, ";
            }
        }
    }
    if (availibleCharacters.length < 1) {
        availibleCharacters.push(
            ...capitalLetterArray,
            ...lowerLetterArray,
            ...numbersArray,
            ...symbolsArray
        );
    }

    return {
        length,
        checkCapital,
        checkLower,
        checkNumbers,
        checkSymbols,
        error,
    };
}

function generatePassword(length) {
    let genPassword = "";
    for (let i = 0; i < length; i++) {
        genPassword +=
            availibleCharacters[
                Math.floor(Math.random() * availibleCharacters.length)
            ];
    }
    return genPassword;
}

function isAllChecksValid(
    password,
    checkCapital,
    checkLower,
    checkNumbers,
    checkSymbols
) {
    let isValid = false;
    if (password.length > 0) {
        if (checkPassword(checkCapital, capitalLetterArray, password)) {
            if (checkPassword(checkLower, lowerLetterArray, password)) {
                if (checkPassword(checkNumbers, numbersArray, password)) {
                    if (checkPassword(checkSymbols, symbolsArray, password)) {
                        isValid = true;
                    }
                }
            }
        }
    }
    return isValid;
}

function checkPassword(type, array, password) {
    let isValid = false;
    if (type === true) {
        password.split("").forEach((char) => {
            if (!isValid) {
                if (array.find((ref) => ref === char) !== undefined) {
                    isValid = true;
                }
            }
        });
    } else {
        isValid = true;
    }
    return isValid;
}
