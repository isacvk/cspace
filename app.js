const express = require("express");

const AppError = require("./utils/appError")
const globalErrorHandler = require("./controller/errorController")

const familyRouter = require("./routes/familyRoutes");
const personRouter = require("./routes/personRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());

// Serving static files
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/family", familyRouter);
app.use("/api/v1/persons", personRouter);
app.use("/api/v1/users", userRouter);

app.all('*',(req,res,next)=>{
    next(new AppError(`can't find ${req.originalUrl} on this server!`,404))
})

app.use(globalErrorHandler)

module.exports = app;
