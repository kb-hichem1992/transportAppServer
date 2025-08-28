const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const saltRounds = 10;

router.post("/register_centre", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const type = req.body.type;
  const numeroAgrement = req.body.numeroAgrement;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        "INSERT INTO user (`USERNAME`, `PASSWORD`, `ADMIN`, `NUMERO_AGREMENT`) VALUES (?,?,?,?)",
        [username, hash, type, numeroAgrement],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Value Added");
          }
        }
      );
    }
  });
});

router.post("/register_service", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const type = req.body.type;
  const wilaya = req.body.wilaya;
  const service = req.body.service;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        "INSERT INTO user_direction (`USERNAME`, `WILAYA`, `SERVICE`, `PASSWORD`, `TYPE`) VALUES (?,?,?,?,?)",
        [username, wilaya, service, hash, type],
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.send("Value Added");
          }
        }
      );
    }
  });
});

router.put("/pass_Center_update", (req, res) => {
  const oldpass = req.body.oldpass;
  const password = req.body.password;
  const username = req.body.username;
  const admin = req.body.admin;
  const numeroAgrement = req.body.numeroAgrement;

  try {
    // First, fetch the stored password from the database
    db.query(
      "SELECT PASSWORD FROM user WHERE USERNAME = ? AND ADMIN = ? AND NUMERO_AGREMENT = ?",
      [username, admin, numeroAgrement],
      (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Database error");
        }

        if (results.length === 0) {
          return res.status(404).send({ message: "المستخدم غير موجود" });
        }

        const storedpass = results[0].PASSWORD;

        // Compare the old password with the stored hash
        bcrypt.compare(oldpass, storedpass, (err, response) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Password comparison error");
          }

          if (response) {
            // Hash the new password
            bcrypt.hash(password, saltRounds, (err, hash) => {
              if (err) {
                console.log(err);
                return res.status(500).send("Password hashing error");
              }

              // Update the password in the database
              db.query(
                "UPDATE user SET `PASSWORD` = ? WHERE `USERNAME` = ? AND `ADMIN` = ? AND `NUMERO_AGREMENT` = ?",
                [hash, username, admin, numeroAgrement],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).send("Update error");
                  }

                  if (result.affectedRows === 0) {
                    return res.status(404).send({ message: "المستخدم غير موجود" });
                  }

                  res.send({ message: "تم تحديث كلمة السر بنجاح" });
                }
              );
            });
          } else {
            res.status(400).send({ message: "كلمة السر القديمة خاطئة" });
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/pass_Direction_update", (req, res) => {
  const oldpass = req.body.oldpass;
  const storedpass = req.body.storedpass;
  const password = req.body.password;
  const username = req.body.username;
  try {
    bcrypt.compare(oldpass, storedpass, (err, response) => {
      if (response) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              "UPDATE user_direction SET `PASSWORD`= ? WHERE `USERNAME`= ?;",
              [hash, username],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send("Values updated");
                }
              }
            );
          }
        });
      } else {
        res.send({ message: "كلمة السر القديمة خاطئة" });
      }
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Token-based session check
router.get("/login", authenticateToken, (req, res) => {
  res.send({ loggedIn: true, user: req.user });
});

// Optional: dedicated current user route
router.get("/auth/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

router.post("/login_centre", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM user WHERE USERNAME = ?;",
    username,
    (err, result) => {
      if (err) {
        return res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].PASSWORD, (error, response) => {
          if (response) {
            const user = {
              username: result[0].USERNAME,
              admin: result[0].ADMIN,
              numeroAgrement: result[0].NUMERO_AGREMENT,
              type: "centre",
            };
            const token = jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
            res.json({ token, user, expiresIn: config.jwt.expiresIn });
          } else {
            res.send({ message: "إسم المستخدم أو كلمة المرور خاطىء" });
          }
        });
      } else {
        res.send({ message: "هذا الحساب غير موجود" });
      }
    }
  );
});

router.post("/login_service", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const service = req.body.service;

  db.query(
    "SELECT * FROM user_direction WHERE USERNAME = ? and SERVICE = ?;",
    [username, service],
    (err, result) => {
      if (err) {
        return res.send({ err: err });
      }

      if (result.length > 0) {
        bcrypt.compare(password, result[0].PASSWORD, (error, response) => {
          if (response) {
            const user = {
              username: result[0].USERNAME,
              wilaya: result[0].WILAYA,
              service: result[0].SERVICE,
              type: result[0].TYPE || "service",
            };
            const token = jwt.sign(user, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
            res.json({ token, user, expiresIn: config.jwt.expiresIn });
          } else {
            res.send({ message: "إسم المستخدم أو كلمة المرور خاطىء" });
          }
        });
      } else {
        res.send({ message: "هذا الحساب غير موجود" });
      }
    }
  );
});

module.exports = router;


