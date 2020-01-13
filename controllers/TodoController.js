const db = require("../db");

const KulunvalvontaController = {
  /**
   * Henkilön todo listan haku
   */
  getTodo: function(req, res, next) {
    let Henkilo = req.query.Henkilo || "%"; // jos Henkilo ei toimiteta hakee kaikki
    console.log("Getting todo");

    query = `SELECT * FROM todo WHERE Henkilo LIKE '${Henkilo}';`;
    // console.log(query);

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.json(results);
    });
  },

  /**
   * todo lisäys.
   */
  addTodo: function(req, res, next) {
    let Henkilo = req.body.Henkilo || "%";
    let Tehtava = req.body.Tehtava || "%";
    console.log("Adding todo");

    query = `INSERT INTO todo (Henkilo, Tehtava) VALUES ('${Henkilo}', '${Tehtava}');`;
    console.log(query);

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.json(results);
    });
  },

  /**
   * todo poisto
   */
  deleteTodo: function(req, res, next) {
    let Henkilo = req.body.Henkilo || "%";
    let Tehtava = req.body.Tehtava || "%";
    console.log("Deleting todo");

    query = `DELETE FROM todo WHERE Henkilo = '${Henkilo}' AND Tehtava = '${Tehtava}';`;
    console.log(query);

    db.query(query, (error, results, fields) => {
      if (error) console.log(error);
      res.send(results);
    });
  }
};

module.exports = KulunvalvontaController;
