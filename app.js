const cors = require('cors')
const express = require("express")
const app = express()
const routes = require("./routes/index")
const errorHandler = require("./middlewares/errorHandler")

app.use(cors())
app.use(express.urlencoded({limit: '50mb', extended:false}))
app.use(express.json({limit: '50mb'}))
app.use(routes)
app.use(errorHandler)

module.exports = app;