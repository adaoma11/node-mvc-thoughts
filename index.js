const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();
const conn = require("./db/conn");

// Import Models
const thought = require("./models/Thought");
const User = require("./models/User");

// Import Routes
const thoughtsRoutes = require("./routes/thoughtsRoutes");
const authRoutes = require("./routes/authRoutes");

// Import Controllers
const thoughtController = require("./controllers/ThoughtController");

// Template Engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

// Receber resposta do body
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

// Session middleware
app.use(
    session({
        name: "session",
        secret: "nosso_secret",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () {},
            path: require("path").join(require("os").tmpdir(), "sessions"),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        },
    })
);

// Flash messages
app.use(flash());

// Public path
app.use(express.static("public"));

// Set session to res
app.use((req, res, next) => {
    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next();
});

// Routes
app.use("/thoughts", thoughtsRoutes);
app.use("/", authRoutes);

app.get("/", thoughtController.showthoughts);

conn
    // .sync({ force: true })
    .sync()
    .then(() => {
        app.listen(3000);
    })
    .catch((err) => console.error(err));
