const express = require('express')
const app = express()
require("dotenv").config();
const PORT = process.env.PORT;
let cors = require('cors')
app.use(cors())
app.use(express.json());



const prodRouter = require('./routes/productRoute')
const categoryRouter = require('./routes/categoryRoute');
const user_router = require('./routes/userRoute');

app.use('/prod',prodRouter)
app.use('/cat', categoryRouter)
app.use("/user", user_router)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })