const express = require("express");
const app = express();
const cors = require("cors");

const PORT = 5000;

app.use(express.json());
app.use(cors());

const userRoute = require("./routes/Users");
app.use("/auth", userRoute);

const postRoute = require("./routes/Posts");
app.use("/posts", postRoute);

const db = require("./models");

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
  });
});
