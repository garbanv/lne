const db = require('../dbConnect')

module.exports = {
    get : async (req,res)=>{
        try {
            const allData = await db.query('select * from authorizedUsers')
            const response = allData.rows 
              res.send(response)
            }
            catch (e) {
              console.log(e)
              res.send("an error ocurred")
            }
    },
    post: async (req,res)=>{
        let {name,lastname,role,email,isactive} = req.body
/*         if(isactive===true){
          isactive=1
        } else {
          isactive=0
        } */
        const dateaccountactivated = new Date()
        const query = {
          text: 'INSERT INTO authorizedusers (name,lastname,role,email,isactive,dateaccountactivated) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
          values: [name,lastname,role,email,isactive,dateaccountactivated],
        }
        // promise
        db
          .query(query)
          .then(data => res.status(200).json(data.rows[0]))
          .catch(e => console.error(e.stack))
    },
    delete: async (req,res) =>{
        console.log("delete route")
        console.log("req.body:", req)
        const {id} = req.body
        console.log("id: ", id)
        const query = {
            text: 'DELETE from authorizedusers where id=$1',
            values: [id],
          }
          // promise
          db
            .query(query)
            .then(data => {
                if(data.rowCount=1){
                    res.send({
                        status:"OK",
                        response:"User deleted"
                    })
                } else {
                    res.send({
                        status:"FAIL",
                        response:"An error ocurred"
                    })
                }
            })
            .catch(e => console.error(e.stack))
    }
}