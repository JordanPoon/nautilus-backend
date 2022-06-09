const express = require('express')
const router = express.Router()
const Utils = require('./../utils')
const Alert = require('./../models/Alert')
const path = require('path')

// GET- get all haircuts ---------------------------
router.get('/', Utils.authenticateToken, (req, res) => {
  Alert.find().populate('user', '_id firstName lastName')
    .then(alerts => {
      if(alerts == null){
        return res.status(404).json({
          message: "No alerts found"
        })
      }
      res.json(alerts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Problem getting haircuts"
      })
    })  
})

// POST - create new haircut --------------------------------------
router.post('/', (req, res) => {
  // validate 
  if(Object.keys(req.body).length === 0){   
    return res.status(400).send({message: "alert content can't be empty"})
  }
  // validate - check if image file exist
//   if(!req.files || !req.files.image){
//     return res.status(400).send({message: "Image can't be empty"})
//   }

  console.log('req.body = ', req.body)

//   // image file must exist, upload, then create new haircut
//   let uploadPath = path.join(__dirname, '..', 'public', 'images')
//   Utils.uploadFile(req.files.image, uploadPath, (uniqueFilename) => {    
    // create new haircut
    let newAlert = new Alert({
      type: req.body.type,
      description: req.body.description,
      icon: req.body.icon,
      user: req.body.user
    })
  
    newAlert.save()
    .then(alert => {        
      // success!  
      // return 201 status with user object
      return res.status(201).json(alert)
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send({
        message: "Problem creating alert",
        error: err
      })
    })
  })

// export
module.exports = router