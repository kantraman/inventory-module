const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

const userAccountsRouter = require("./src/routes/userAccountsRouter");
const inventoryRouter = require("./src/routes/inventoryRouter");
const salesRouter = require("./src/routes/salesRouter");
const purchaseRouter = require("./src/routes/purchaseRouter");
const dashboardRouter = require("./src/routes/dashboardRouter");

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/admin", userAccountsRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/sales", salesRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/dashboard", dashboardRouter);

// app.use(express.static(path.resolve(__dirname, "./client")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "./client", "index.html"));
// });
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
  if (!res.headersSent)
    res.status(err.status || 500)
    res.send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  })


mongoose.connect(process.env.DBConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(app.listen(PORT, () =>
        console.log(`Server listening on PORT ${PORT}`)))
    .catch((err) => console.log(err));
