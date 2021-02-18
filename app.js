const cors = require('cors')
const express = require("express")
const app = express()
const routes = require("./routes/index")
const errorHandler = require("./middlewares/errorHandler")

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(routes);

app.use(errorHandler)

module.exports = app;