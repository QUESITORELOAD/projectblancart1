const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const sql = require("mssql");

const config = {
  server: "mssql-162047-0.cloudclusters.net",
  port: 19911,
  database: "DBBlancarT1",
  user: "adminmarkov",
  password: "Phopl288k",
  options: {
    encrypt: true,
    trustServerCertificate: true, // Check if the server's SSL certificate is valid and trusted by the client. If the certificate is not trusted, you may need to install the certificate on the client machine. DL+balckbox AI 27/01/2024
  },
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

sql.connect(config, (err) => {
  try {
    if (err) {
      console.error(err);
      return;
    }
    console.log("DataBase OK");
  } catch (err) {
    console.error("Data base connection error:", err);
  } finally {
    // Close the connection
    sql.close();
  }
});
//second option by DL
async function getLoginData() {
  try {
    console.log("GetLoginData init");
    // Make a connection to the database
    await sql.connect(config);

    // Create a request object
    const request = new sql.Request();

    // Execute a query
    const result = await request.query("SELECT * FROM Users");
    console.log("Result query:", result.recordset);
    // Map the result to an array of objects
    const loginData = result.recordset.map((item) => {
      return {
        id: item.UserID,
        personid: item.Username,
        password: item.Password,
        email: item.Email,
      };
    });

    return loginData;
  } catch (err) {
    console.error("Error:", err);
    return [];
  } finally {
    // Close the connection
    await sql.close();
  }
}

// Define routes
// Define the endpoint to get a single item by ID
app.get("/users/:username/:password", async (req, res) => {
  const loginData = await getLoginData();
  const itemUsername = req.params.Username;
  const itemPassword = req.params.password;
  const item = loginData.find(
    (i) => i.Username === itemUsername && i.password === itemPassword
  );

  if (!item) {
    res.status(404).send("User Not Found");
    console.log("status code 404");
  } else {
    delete item.password;
    res.json(item);
  }
});

app.get("/api/users", (req, res) => {
  // Your code to fetch users from the database
});

app.post("/api/users", (req, res) => {
  // Your code to create a new user in the database
});

app.put("/api/users/:id", (req, res) => {
  // Your code to update a user in the database
});

app.delete("/api/users/:id", (req, res) => {
  // Your code to delete a user from the database
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
