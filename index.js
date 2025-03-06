require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const session = require('express-session')
const flash = require('express-flash')

const database = require("./config/database")

// Import variables
const systemConfig = require("./config/system")

// Import Routes
const routeAdmin = require("./routes/admin/index.route")
const routeClient = require("./routes/client/index.route")

database.connect()

const app = express();
const port = process.env.PORT;

// cookie-parser
app.use(cookieParser(process.env.COOKIE_PARSER));

// Flash
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`)
app.set("view engine", "pug");


// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static(`${__dirname}/public`))

// Routes
routeAdmin(app)
routeClient(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})