const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const app = express();
const PORT = process.env.PORT || 4000;
const bodyParser = require("body-parser");
const cors = require('cors');
const morgan = require("morgan");
// const { notFound, errorHandler } = require("./middlewares/errorHandler");
const textEmotionRoute = require("./routes/textEmotion.route");
const userRoute = require("./routes/user.route");
const contactRoute = require("./routes/contact.routes");
const feedbackRoute = require("./routes/feedback.routes");

dbConnect();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(notFound);
// app.use(errorHandler);

app.use("/api/text", textEmotionRoute);
app.use("/api/user", userRoute);
app.use("/api/contact", contactRoute);
app.use("/api/feedback", feedbackRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});