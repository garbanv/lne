require('dotenv').config()
const { urlencoded } = require('express')
const express = require('express')
var cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
app.use(urlencoded({extended:true}))
const port = process.env.PORT || 5500

const { Pool,Client } = require('pg')
const { user } = require('pg/lib/defaults')

const client = new Client(
  {
      user:process.env.DBUSER,
      host:process.env.HOST,
      database:process.env.DATABASE,
      password:process.env.PASSWORD,
      port: 5432,
      //ssl:true
      ssl:{ rejectUnauthorized: false }
    }
)
client.connect()


const authorizedUserRoute = require('./routes/authuser')
app.use('/authorizedusers', authorizedUserRoute)

const usersRoute = require('./routes/users')
app.use('/users', usersRoute)





/* PORT */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})