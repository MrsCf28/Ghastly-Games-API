exports.handleEndPointErrors =
    ('/api/*',
    (req, res) => {
        res.status(404).send({ msg: 'Route not found' });
    });

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else {
        next(err);
    }
};

exports.handleInternalErrors = (err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
};
