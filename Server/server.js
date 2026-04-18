const express = require('express');
const cors = require('cors');
require('dotenv').config()
const router = require('./Routes/routes');



const app = express();
const port = process.env.PORT || 8000
 

 console.log(process.env.PORT)

app.use(express.json());

app.use(cors());
app.use(router)

app.listen(port, () => {
  console.log(`Server is Live on port ${port}`);
});

