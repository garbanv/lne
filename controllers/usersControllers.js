const db = require("../dbConnect");

module.exports = {
  get: async (req, res) => {
    try {
      const allData = await db.query("select * from users");
      const response = allData.rows;
      res.send(response);
    } catch (e) {
      res.send("an error ocurred");
    }
  },
  post: async (req, res) => {
    const { name, lastname, userrole, email, dateaccountactivated } = req.body;
    const text =
      "INSERT INTO users(name,lastname,userrole,useremail,dateaccountactivated) VALUES($1, $2,$3,$4,$5) RETURNING *";
    const values = [name, lastname, userrole, email, dateaccountactivated];
    // callback
    client.query(text, values, (err, res) => {
      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    });
  },
  delete: async (req, res) => {
    const { id } = req.body;
    const query = {
      text: "DELETE from users where id=$1",
      values: [id],
    };
    // promise
    db.query(query)
      .then((data) => {
        if ((data.rowCount = 1)) {
          res.send({
            status: "OK",
            response: "User deleted",
          });
        } else {
          res.send({
            status: "FAIL",
            response: "An error ocurred",
          });
        }
      })
      .catch((e) => console.error(e.stack));
  },
  put: async (req, res) => {
    const { datelastlogin, useremail } = req.body;
    try {
      const query = await {
        name: "update-last-login",
        text: `update users set datelastlogin=$1 where useremail=$2`,
        values: [datelastlogin, useremail],
      };
      client
        .query(query)
        .then((response) =>
          res.json({
            data: response.rowCount,
            status: 200,
          })
        )
        .catch((e) => res.send(e.stack));
    } catch (error) {
      res.json("an error ocurred");
      console.log("error message:", error);
    }
  },
};
