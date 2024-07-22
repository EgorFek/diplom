const express = require("express");
const cors = require("cors");
const session = require("express-session");
const db = require("./models");

const dotenv = require("dotenv");
dotenv.config();

const User = require("./routes/User");
const Dish = require("./routes/Dish");
const DishCategory = require("./routes/DishCategory");
const Order = require("./routes/Order");
const Session = require("./routes/Session");
const Table = require("./routes/Table");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(
  session({
    key: "userID",
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", User);
app.use("/api/v1/dish", Dish);
app.use("/api/v1/category", DishCategory);
app.use("/api/v1/order", Order);
app.use("/api/v1/session", Session);
app.use("/api/v1/table", Table);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(
        `Server started on [http://localhost:${process.env.SERVER_PORT}]`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
