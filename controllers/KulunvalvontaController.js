const db = require("../db");

const KulunvalvontaController = {
  getKulunvalvonta: function(req, res, next) {
    let query;
    let Henkilo = req.query.Henkilo || "%";
    let Pvmfrom = req.query.Pvmfrom || "2000-01-01";
    let Pvmto = req.query.Pvmto || "3000-01-01";

    query = `
    SELECT 
      *
    FROM 
      kulunvalvonta 
    WHERE 
      Henkilo LIKE '${Henkilo}' AND (Alkoi BETWEEN '${Pvmfrom} 00:00:00' AND '${Pvmto} 23:59:59');`;
    console.log(query);

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.send(results);
    });
  },

  getAll: function(req, res, next) {
    query = `SELECT * FROM kulunvalvonta;`;

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.json(results);
    });
  },

  getHenkilos: function(req, res, next) {
    query = `SELECT DISTINCT(Henkilo) FROM kulunvalvonta;`;

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.send(results);
    });
  },

  startWork: function(req, res, next) {
    let Henkilo = req.body.Henkilo;
    let Alkoi = req.body.Alkoi;

    query = `INSERT INTO kulunvalvonta (Henkilo, Alkoi) VALUES ('${Henkilo}', '${Alkoi}');`;

    console.log(query);

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.send(results);
    });
  },

  endWork: function(req, res, next) {
    let Henkilo = req.body.Henkilo;
    let Alkoi = req.body.Alkoi;
    let Paattyi = req.body.Paattyi;

    query1 = `UPDATE kulunvalvonta SET Paattyi = '${Paattyi}' WHERE Henkilo = '${Henkilo}' AND Alkoi = '${Alkoi}';`;
    query2 = `UPDATE kulunvalvonta SET Kesto = timediff(Paattyi, Alkoi) WHERE Henkilo = '${Henkilo}' AND Alkoi = '${Alkoi}';`;

    db.beginTransaction(err => {
      if (err) throw err;

      // 1. Lisää Paattyi aika.
      db.query(query1, (error, results, fields) => {
        if (error)
          conn.rollback(() => {
            throw error;
          });

        // 2. Lisää Kesto Alkoi vs Paattyi.
        db.query(query2, (error, results, fields) => {
          if (error)
            conn.rollback(() => {
              throw error;
            });

          //Jos kaikki meni ok niin committaa transaktiot
          db.commit(function(error) {
            if (error)
              conn.rollback(() => {
                throw error;
              });
            console.log("Transaction success!");
            res.send(results);
          });
        });
      });
    });
  },

  deleteHenkilo: function(req, res, next) {
    query = "DELETE FROM kulunvalvonta WHERE (`Id` = '9999');";

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.send(results);
    });
  }
};

module.exports = KulunvalvontaController;
