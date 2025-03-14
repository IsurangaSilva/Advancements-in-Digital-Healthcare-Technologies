const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const cors = require('cors');
// const { notFound, errorHandler } = require("./middlewares/errorHandler");
const textEmotionRoute = require("./routes/textEmotion.route");

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// app.use(notFound);
// app.use(errorHandler);

app.use("/api/text", textEmotionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});