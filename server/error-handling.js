exports.badRequestId = id_name =>
    Promise.reject({
        status: 400,
        msg: `bad request - ${id_name} is not a number`,
    });

exports.badRequestNeg = non_neg_value =>
    Promise.reject({
        status: 400,
        msg: `bad request - ${non_neg_value} cannot be negative`,
    });

exports.badRequestQuery = query =>
    Promise.reject({
        status: 400,
        msg: `bad request - ${query} needed`,
    });

exports.itemNotFound = item_name =>
    Promise.reject({
        status: 404,
        msg: `${item_name} not found`,
    });

exports.invalidRequestParameter = param =>
    Promise.reject({
        status: 400,
        msg:`bad request - ${param} is an invalid request parameter`
    })
