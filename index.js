const dotenv = require('dotenv');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('./routers/users');
const authRoute = require('./routers/auth');
const productRoute = require('./routers/product');
const cartRoute = require('./routers/cart');
const orderRoute = require('./routers/order');
const cors = require("cors");

dotenv.config();

mongoose.connect
(process.env.MONGO_URL)
.then(() => console.log("Banco De Dados Funcionando!")).catch((err)=>{
    console.log(err);
})

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);



app.listen(process.env.PORT || 5000, () => {
    console.log("Server rodando na porta");
});