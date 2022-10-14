const app = require('./server/app.js');

const { PORT = 9090 } = process.env;

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening on port ${PORT}...`);
});
