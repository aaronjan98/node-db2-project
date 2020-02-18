const express = require("express");

const db = require('../data/dbConfigs.js');

const router = express.Router();

router.get('/', (req,res) => {
    db('*')
      .from('cars')
      .then(accounts => {
        res.status(200).json(accounts);
      })
      .catch(error => {
        console.log(error);
  
        res.status(500).json({ error: "failed to get the list of accounts" });
      });
})


router.post('/', (req, res) => {
    db('cars')
      .insert(req.body, 'VIN')
      .then(ids => {
        return getById(ids).then(inserted => {
          res.status(201).json(inserted);
        });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "failed to add the car information" });
      });
});

// custom middleware

function validateVIN(req, res, next) {
    const { id } = req.params;

    getById(id)
    .then(car => {
      console.log('car', car);
      if( !Object.keys(car).length ){
        res.status(400).json({ message: "invalid car id" });
      }else next();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `Couldn't retrieve a car with id: ${id}` });
    });
}

module.exports = router;

function getById(VIN) {
    return db('cars')
      .where({ VIN })
      .first();
}