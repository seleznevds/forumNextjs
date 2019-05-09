const express = require('express');
const next = require('next');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionStore = require('connect-mongo');
require('dotenv').config();
const api = require('./api');

/*const votesApi = require('./routes/votes');
const postsApi = require('./routes/posts');
const commentsApi = require('./routes/comments');*/

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
).catch(err => { });

const dev = process.env.NODE_ENV !== 'production';

const port = process.env.PORT || 8000;
const ROOT_URL = `http://localhost:${port}`;


const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = express();

    const MongoStore = mongoSessionStore(session);
    const sess = {
        name: 'forum.sid',
        secret: process.env.SESSION_SECRET,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 2 * 24 * 60 * 60, // save session 14 days
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 2 * 24 * 60 * 60 * 1000,
        },
    };

    server.use(session(sess));

    server.use(bodyParser.urlencoded({
        extended: false
    }));

    server.use(bodyParser.json());

    // Set up a whitelist and check against it:

    var corsOptions = {
        origin: [/http[s]?:\/\/localhost:.*/]
    }

    // Then pass them to cors:
    server.use(cors(corsOptions));

    api(server);

    server.get('/post/:postId', (req, res) => {
        const { postId } = req.params;
        app.render(req, res, '/post', { postId });
    });


    server.get('*', (req, res) => {
        if (req.path) {
            app.render(req, res, req.path);
        } else {
            handle(req, res);
        }
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`> Ready on ${ROOT_URL}`);
    });
});