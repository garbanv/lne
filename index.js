require('dotenv').config()
const { urlencoded } = require('express')
const express = require('express')
var cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors())
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

//USERS ENDPOINT

app.get('/users', async (req,res)=>{
  try {
    const allData = await client.query('select * from users')
    const response = allData.rows 
      res.send(response)
      console.log("success")
    }
    catch (e) {
      console.log(e)
      res.send("an error ocurred")
    }
})

app.put('/users/lastlogin', async(req,res)=>{
  const {datelastlogin,useremail}= req.body
  try {
    const query = await  {
      name:"update-last-login",
      text:`update users set datelastlogin=$1 where useremail=$2`,
      values:[datelastlogin,useremail]
    }
    client
    .query(query)
    .then(response => res.json({
      data:response.rowCount,
      status:200
    }))
    .catch(e => res.send(e.stack))

  }
  catch(error) {
    res.json("an error ocurred")
    console.log("error message:", error)
  }

})

app.post('/users/create', async (req,res)=>{


const {name,lastname,userrole,email} = req.body
const text = 'INSERT INTO users(name,lastname,userrole,useremail) VALUES($1, $2,$3,$4) RETURNING *'
const values = [name,lastname,userrole,email]
// callback
client.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})

})




/* AUTHORIZED USERS */

app.get('/authorizedusers', async (req,res)=>{
  try {
    const allData = await client.query('select * from authorizedusers')
    const response = allData.rows 
      res.send(response)
      console.log("success")
    }
    catch (e) {
      console.log(e)
      res.send("an error ocurred")
    }
})

/* app.post('/authorizedusers/create', async (req,res)=>{
  const {name,lastname,role,email} = req.body
  const text = 'INSERT INTO authorizedusers (name,lastname,role,email) VALUES($1,$2,$3,$4) RETURNING *'
  const values = [name,lastname,role,email]
  
  const result = await client.query(text, values, (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
    
      return  res.rows[0]
      
    }
  })
  
res.status(200)

  }) */


  app.post('/authorizedusers/create', async (req,res)=>{
    let {name,lastname,role,email,isactive} = req.body
    if(isactive===true){
      isactive=1
    } else {
      isactive=0
    }
    const dateaccountactivated = new Date()
    const query = {
      text: 'INSERT INTO authorizedusers (name,lastname,role,email,isactive,dateaccountactivated) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      values: [name,lastname,role,email,isactive,dateaccountactivated],
    }
    // promise
    client
      .query(query)
      .then(data => res.status(200).json(data.rows[0]))
      .catch(e => console.error(e.stack))
    })


/* PORT */

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})