const successResponse = (status= "success",message, response = {} ) => {
    return {status, message, response}
}


const failureResponse = (status="failure", message, response = {}) => {
    return {
        status,
        message,
        response
    }
}

module.exports = { successResponse, failureResponse};