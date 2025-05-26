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
const averageAllEmotionRoute = require("./routes/averageEmotion.route");
const voiceEmotionRoute = require("./routes/voiceEmotion.route");
const userRoute = require("./routes/user.route");
const contactRoute = require("./routes/contact.routes");
const feedbackRoute = require("./routes/feedback.routes");
const ferEmotionsRoute = require("./routes/ferEmotion.route");
const audioEmotionRoute = require("./routes/audioEmotion.route");
const depressionRoute = require("./routes/depression.route");
const { startScheduler } = require('./middleware/startShedular'); 

dbConnect();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(notFound);
// app.use(errorHandler);

// Start the scheduler
if (process.env.NODE_ENV !== 'test') { 
  startScheduler();
}

app.use("/api/text", textEmotionRoute);
app.use("/api/average", averageAllEmotionRoute);
app.use("/api/voice", voiceEmotionRoute);
app.use("/api/user", userRoute);
app.use("/api/contact", contactRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/fer", ferEmotionsRoute);
app.use("/api/audio", audioEmotionRoute);
app.use("/api/depression", depressionRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});