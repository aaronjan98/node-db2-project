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

router.put("/", (req, res) => {
    const VIN = req.body.VIN;
    const changes = req.body;

    db('cars')
      .where({ VIN }) // remember to filter or all records will be updated (BAD PANDA!!)
      .update(changes) // could be partial changes, only one column is enough
      .then(count => {
        res.status(200).json(count);
      })
      .catch(error => {
        console.log(error);
  
        res.status(500).json({ error: "failed to update the car information." });
      });
});

router.delete('/', (req, res) => {
    const VIN = req.body.VIN;
    console.log('VIN', VIN);

    db('cars')
      .where({ VIN })
      .del()
      .then(count => {
        res.status(200).json(count);
      })
      .catch(error => {
        console.log(error);
  
        res.status(500).json({ error: "failed to remove the car" });
      });
});

// custom middleware

function validateVIN(req, res, next) {
    const { VIN } = req.body.VIN;

    getById(VIN)
    .then(car => {
      console.log('car', car);
      if( !Object.keys(car).length ){
        res.status(400).json({ message: "invalid car VIN" });
      }else next();
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: `Couldn't retrieve a car with VIN: ${VIN}` });
    });
}

module.exports = router;

function getById(VIN) {
    return db('cars')
      .where({ VIN })
      .first();
}