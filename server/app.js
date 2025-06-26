if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const cors = require("cors");
const router = require("./routers");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

app.use(router);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`[LOG] App listening on port ${port}`);
});
