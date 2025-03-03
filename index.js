require("dotenv").config()
const express = require('express');
const database = require("./config/database")

// Import variables
const systemConfig = require("./config/system")

// Import Routes
const routeAdmin = require("./routes/admin/index.route")

database.connect()

const app = express();
const port = process.env.PORT;

app.set('views', `${__dirname}/views`)
app.set("view engine", "pug");

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static(`${__dirname}/public`))

// Routes
routeAdmin(app)

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})