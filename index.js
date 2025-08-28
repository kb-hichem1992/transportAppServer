const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const { authenticateToken } = require("./middleware/auth");

// Ensure the DB pool is initialized once
require("./db");

// Routers
const authRouter = require("./routes/auth");
const miscRouter = require("./routes/misc");
const operateursRouter = require("./routes/operateurs");
const formationsRouter = require("./routes/formations");
const passeRouter = require("./routes/passe");
const travailRouter = require("./routes/travail");
const vehiculesRouter = require("./routes/vehicules");  
const candidatsRouter = require("./routes/candidats");
const reportsRouter = require("./routes/reports");
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(config.paths.staticFiles));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Mount routers
app.use(authRouter); // public (login/register)

// Require JWT for everything below
app.use(authenticateToken);

app.use(miscRouter);
app.use(candidatsRouter);
app.use(operateursRouter);
app.use(formationsRouter);
app.use(passeRouter);
app.use(travailRouter);
app.use(vehiculesRouter);
app.use(reportsRouter);

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port} in ${config.server.nodeEnv} mode`);
});


