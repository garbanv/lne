require('dotenv').config()
const { urlencoded } = require('express')
const express = require('express')
const app = express()

const port = process.env.PORT || 5500

app.use(urlencoded({extended:true}))


const { Pool,Client } = require('pg')
const { user } = require('pg/lib/defaults')
// pools will use environment variables
// for connection information
/* const pool = new Pool(
    {
        user: 'postgres',
        host: 'localhost',
        database: 'lanuevatest',
        password: '12345',
        port: 5432,
      }
) */

/* const client = new Client(
  {
      user: 'alexei',
      host: 'free-tier7.aws-eu-west-1.cockroachlabs.cloud',
      database: 'dusty-bison-2007.defaultdb',
      password: 'AZOSwByGDBQbQErRqRMq9Q',
      port: 26257,
      ssl:true
    }
) */



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


/* app.get('/', async (req, res) => {
    
const allData = await pool.query('select * from users INNER JOIN clients ON users.id = clients.userid where users.id=1') 
const allData = await pool.query('select users.id as userId,users.name as username,clients.id as clientsId, clients.name as clientName from users INNER JOIN clients ON users.id = clients.userid ')
const result = allData.rows
const users = []
result.forEach(row=> {
    const user ={}
    const clients = []
    const client = {}
    user.userId=row.userId
    user.userName=row.username
    client.id=row.clientsid
    client.name=row.clientname
    clients.push(client)
    user.clients=clients 
    users.push(user)
})
res.json(users)
}) */

app.get('/authorized-users', async (req,res)=>{
  try {
  const allData = await client.query('select * from authorizedUsers')
  const response = allData.rows 
    res.send(response)
  }
  catch (e) {
    console.log(e)
    res.send("an error ocurred")
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})