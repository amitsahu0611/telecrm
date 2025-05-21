/** @format */

const express = require("express");
const cors = require("cors");
const colors = require("colors");
const dotenv = require("dotenv");
const path = require("path");
const {dbConnection} = require("./connection/db_connection");
const userRouter = require("./routes/users.route");
const leadRouter = require("./routes/lead.route");
const workspaceRouter = require("./routes/workspace.route");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 8001;

app.use(
  cors({
    origin: "*",
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
// app.use(logMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({limit: "10mb", extended: true}));

app.use("/api/user", userRouter);
app.use("/api/lead", leadRouter);
app.use("/api/workspace", workspaceRouter);

app.listen(PORT, () => {
  dbConnection();
  console.log(colors.rainbow(`Server running on PORT ${PORT}...`));
});
