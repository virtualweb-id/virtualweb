const cors = require('cors')
const express = require("express")
const app = express()
const db = require('./models')
const routes = require("./routes")
const errorHandler = require("./middlewares/errorHandler")

app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(routes);
app.use(errorHandler)
db.sequelize.sync({ force: true })
  .then(() => console.log('Drop and Resync DB'))

module.exports = app;