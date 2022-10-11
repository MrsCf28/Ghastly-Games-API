const { fetchUsers } = require('../models/usersModels');

exports.getUsers = (request, response, next) => {
    fetchUsers().then(users => {
        response.status(200).send({ users });
    });
};
