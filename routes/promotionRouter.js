const express = require('express');
const bodyParser = require('body-parser');
const Promotion = require('../models/promotion');
const authenticate = require('../authenticate');
const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json())
const cors = require('./cors');

promotionRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
    .get(cors.cors,(req, res,next) => {
        Promotion.find()
        .then(promotion =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    })
    .post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res,next) => {
        Promotion.create(req.body)
        .then(promotion =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /promotions');
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res,next) => {
        Promotion.deleteMany()
        .then(promotion =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    });

promotionRouter.route('/:promotionId')
    .options(cors.corsWithOptions,(req,res)=>res.sendStatus(200))
    .get(cors.cors,(req, res,next) => {
        Promotion.findById(req.params.promotionId)
        .then(promotion =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    })
    .post(cors.corsWithOptions,authenticate.verifyUser,(req, res) => {
        res.statusCode = 403;
        res.end(`POST operation is not supported on /promotions/${req.params.promotionId}`);
    })
    .put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res,next) => {
        Promotion.findByIdAndUpdate(req.params.promotionId,{$set: req.body},{new:true})
        .then(promotion =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    })
    .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res) => {
        Promotion.findByIdAndDelete(req.params.promotionId)
        .then(promotion =>{
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(promotion)
        })
        .catch(err => next(err))
    });


module.exports = promotionRouter;