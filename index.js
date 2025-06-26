const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwtUtil = require("jsonwebtoken");
const app = express();
const jwtParser = require("./jwt-parser");
const connection = require("./connection-db");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/inscription", (req, res) => {
  const utilisateur = req.body;

  bcrypt.hash(utilisateur.password, 10, (err, hash) => {
    connection.query(
      "INSERT INTO utilisateur(email, password) VALUES (?,?)",
      [utilisateur.email, hash],
      (err, resultat) => {
        if (err) {
          console.debug(err);
          return res.sendStatus(500);
        }

        res.json({ message: "utilsateur enregistré" });
      }
    );
  });
});

app.post("/connexion", (req, res) => {
  const utilisateur = req.body;

  connection.query(
    "SELECT * FROM utilisateur WHERE email = ?",
    [utilisateur.email],
    (err, resultat) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }

      if (resultat.length != 1) {
        return res.sendStatus(401);
      }

      bcrypt.compare(
        utilisateur.password,
        resultat[0].password,
        (err, compatible) => {
          if (err) {
            console.debug(err);
            return res.sendStatus(500);
          }

          if (compatible) {
            return res.send(
              jwtUtil.sign({ email: utilisateur.email }, "azerty123")
            );
          }

          return res.sendStatus(401);
        }
      );
    }
  );
});


app.get("/chien/:id", jwtParser, (req, res) => {
  const id = req.params.id;

  connection.query("SELECT * FROM chien WHERE id = ?", [id], (err, chiens) => {
    console.log(chiens);
    if (err) {
      console.debug(err);
      return res.sendStatus(500);
    }
    if (chiens.length === 0) {
      return res.sendStatus(404);
    }
    res.json(chiens[0]);
  });
});

app.get("/chien", (req, res) => {
  connection.query("SELECT * FROM chien", (err, chiens) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.json(chiens);
  });
});


app.post("/chien", jwtParser, (req, res) => {
  const chien = req.body;

 
  if (
    !chien.nom ||
    chien.nom.length < 3 ||
    chien.nom.length > 50 ||
    !chien.race ||
    chien.race.length < 2 ||
    (chien.description && chien.description.length > 255)
  ) {
    return res.sendStatus(400); 
  }

  
  connection.query(
    "SELECT * FROM chien WHERE nom = ?",
    [chien.nom],
    (err, lignes) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }

      if (lignes.length >= 1) {
        return res.sendStatus(409); 
      }

      
      connection.query(
        `INSERT INTO chien (race, nom, nom_image, description, utilisateur_id)
         VALUES (?,?,?,?,?)`,
        [
          chien.race,
          chien.nom,
          chien.nom_image || null,
          chien.description,
          req.user.id,
        ],
        (err) => {
          if (err) {
            console.debug(err);
            return res.sendStatus(500);
          }
          res.json(chien);
        }
      );
    }
  );
});


app.put("/chien/:id", jwtParser, (req, res) => {
  const id = req.params.id;
  const chien = { ...req.body, id };

  if (
    !chien.nom ||
    chien.nom.length < 3 ||
    chien.nom.length > 50 ||
    !chien.race ||
    chien.race.length < 2 ||
    (chien.description && chien.description.length > 255)
  ) {
    return res.sendStatus(400);
  }

  
  connection.query(
    "SELECT * FROM chien WHERE nom = ? AND id != ?",
    [chien.nom, id],
    (err, lignes) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }
      if (lignes.length >= 1) {
        return res.sendStatus(409);
      }

      connection.query(
        `UPDATE chien
           SET race = ?, nom = ?, nom_image = ?, description = ?
         WHERE id = ?`,
        [
          chien.race,
          chien.nom,
          chien.nom_image || null,
          chien.description,
          id,
        ],
        (err) => {
          if (err) {
            console.debug(err);
            return res.sendStatus(500);
          }
          res.json(chien);
        }
      );
    }
  );
});

app.delete("/chien/:id", jwtParser, (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM chien WHERE id = ?",
    [id],
    (err, chiens) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }
      if (chiens.length === 0) {
        return res.sendStatus(404);
      }

        connection.query(
          "DELETE FROM chien WHERE id = ?",
          [id],
          (err) => {
            if (err) {
              console.debug(err);
              return res.sendStatus(500);
            }
            res.sendStatus(204); 
          }
        );
  });
});

app.get("/cours", (req, res) => {
  connection.query("SELECT * FROM cours", (err, rows) => {
    if (err) {
      console.debug(err);
      return res.sendStatus(500);
    }
    res.json(rows);
  });
});


app.get("/cours/:id", (req, res) => {
  const { id } = req.params;
  connection.query(
    "SELECT * FROM cours WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }
      if (rows.length === 0) return res.sendStatus(404);
      res.json(rows[0]);
    }
  );
});


app.post("/cours", jwtParser, (req, res) => {
  const { nom, date_cours, places_disponibles, image_path } = req.body;

 
  if (
    !nom || nom.length < 3 || nom.length > 50 ||
    !date_cours ||
    !places_disponibles || places_disponibles < 1
  ) {
    return res.sendStatus(400);
  }

 
  connection.query(
    "SELECT 1 FROM cours WHERE nom = ?",
    [nom],
    (err, rows) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }
      if (rows.length) return res.sendStatus(409); 

      
      connection.query(
        `INSERT INTO cours (nom, date_cours, places_disponibles, image_path)
         VALUES (?,?,?,?)`,
        [nom, date_cours, places_disponibles, image_path || null, req.user.id],
        (err, result) => {
          if (err) {
            console.debug(err);
            return res.sendStatus(500);
          }
          res.status(201).json({ id: result.insertId, nom });
        }
      );
    }
  );
});


app.put("/cours/:id", jwtParser, (req, res) => {
  const { id } = req.params;
  const { nom, date_cours, places_disponibles, image_path } = req.body;

  if (
    !nom || nom.length < 3 || nom.length > 50 ||
    !date_cours ||
    !places_disponibles || places_disponibles < 1
  ) {
    return res.sendStatus(400);
  }

  
  connection.query(
    "SELECT * FROM cours WHERE nom = ? AND id != ?",
    [nom, id],
    (err, rows) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }
      if (rows.length) return res.sendStatus(409);

      // autorisation : admin OU créateur
      connection.query(
        "SELECT id FROM cours WHERE id = ?",
        [id],
        (err, rows2) => {
          if (err) return res.sendStatus(500);
          if (!rows2.length) return res.sendStatus(404);

          const createur = rows2[0].utilisateur_id;
          if (req.user.nom !== "administrateur" && req.user.id !== createur) {
            return res.sendStatus(401);
          }

          // update
          connection.query(
            `UPDATE cours
               SET nom = ?, date_cours = ?, places_disponibles = ?, image_path = ?
             WHERE id = ?`,
            [nom, date_cours, places_disponibles, image_path || null, id],
            (err) => {
              if (err) {
                console.debug(err);
                return res.sendStatus(500);
              }
              res.json({ id, nom });
            }
          );
        }
      );
    }
  );
});


app.delete("/cours/:id", jwtParser, (req, res) => {
  const id = req.params.id;

  connection.query(
    "SELECT * FROM cours WHERE id = ?",
    [id],
    (err, cours) => {
      if (err) {
        console.debug(err);
        return res.sendStatus(500);
      }
      if (cours.length === 0) {
        return res.sendStatus(404);
      }

      connection.query(
        "DELETE FROM cours WHERE id = ?",
        [id],
        (err) => {
          if (err) {
            console.debug(err);
            return res.sendStatus(500);
          }
          res.sendStatus(204); 
        }
      );
    }
  );
});

/* ------------------------------------------------------------------ */

app.listen(5000, () => {
  console.log("Serveur en cours d'execution sur le port 5000");
});