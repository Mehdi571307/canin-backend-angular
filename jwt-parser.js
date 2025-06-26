const jwtUtil = require("jsonwebtoken");
const connection = require("./connection-db");

function auth(req, res, next) {
  const jwtToken = req.headers["authorization"];
  if (!jwtToken) {
    return res.status(401).json({ message: "Non autorisé" });
  }
  jwtUtil.verify(jwtToken, "azerty123", (err, decoded) => {
    const email = decoded.email;

    connection.query(
      "SELECT u.id, u.email FROM utilisateur u WHERE email = ?",
      [email],
      (err, lignes) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Erreur interne du serveur");
        }
    
        if (lignes.length === 0) {
          // cas particulier : utilisateur inexistant (ex: supprimé)
          return res.status(401).send("Utilisateur non trouvé ou non autorisé");
        }
    
        // Tout est ok : on stocke l'utilisateur dans req.user
        req.user = lignes[0];
        next();
      }
    );
    

    if (err) {
      return res.status(401).json({ message: "Non autorisé" });
    }
  });
}

module.exports = auth;
