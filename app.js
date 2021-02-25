const cors = require('cors')
const express = require("express")
const app = express()
const routes = require("./routes/index")
const { errorHandler } = require("./middlewares")

app.use(cors())
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(routes)
app.use(errorHandler)

global.__basedir = __dirname;

module.exports = app;