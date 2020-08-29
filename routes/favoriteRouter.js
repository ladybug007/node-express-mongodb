const express = require('express');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorite = require('../models/favorites');
const Campsite = require('../models/campsite');


const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200)
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorite => {
                if (!favorite) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite)
                }
                else {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite.campsites)
                }
            })
            .catch(err => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    (req.body).forEach(campsite => {
                        if (favorite.campsites.indexOf(campsite._id) === -1) {
                            favorite.campsites.push(campsite._id)
                        }
                    })
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json')
                            res.json(favorite)
                        })
                        .catch(err => next(err))

                }
                if (!favorite) {
                    Favorite.create({ user: req.user._id })
                        .then(favorite => {
                            req.body.forEach(campsite => {
                                if (favorite.campsites.indexOf(campsite._id) === -1) {
                                    favorite.campsites.push(campsite._id)
                                }
                            })
                            favorite.save()
                                .then(favorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json')
                                    res.json(favorite)
                                })
                                .catch(err => next(err))
                        })
                        .catch(err => next(err))
                }

            })
            .catch(err => next(err))
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites')
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    favorite.remove()
                        .then(favorite => {
                            res.statusCode = 200
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite)
                        })
                        .catch(err => next(err))
                }
                else {
                    res.statusCode = 200
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite)
                }
            })
            .catch(err => next(err))
    });

favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`)
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Campsite.findOne({ _id: req.params.campsiteId })
            .then(campsite => {
                if (campsite) {
                    console.log(campsite)
                    Favorite.findOne({ user: req.user._id })
                        .then(favorite => {
                            if (favorite) {
                                if (favorite.campsites.indexOf(req.params.campsiteId) === -1) {
                                    favorite.campsites.push(req.params.campsiteId)
                                    favorite.save()
                                        .then(favorite => {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json')
                                            res.json(favorite)
                                        })
                                        .catch(err => next(err))
                                }
                                else {

                                    res.end('That campsite is already in the list of favorites!')
                                }
                            }
                            else {
                                Favorite.create({ user: req.user._id })
                                    .then(favorite => {
                                        favorite.campsites.push(req.params.campsiteId)
                                        favorite.save()
                                            .then(favorite => {
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json')
                                                res.json(favorite)
                                            })
                                            .catch(err => next(err))
                                    })
                                    .catch(err => next(err))
                            }
                        })
                        .catch(err => next(err))
                }
                else {
                    res.end(`campsite ${req.params.campsiteId} does not exist`)
                }

            })

            .catch(err => next(err))

    })


    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`)
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                favorite.campsites = favorite.campsites.filter(campsiteId => campsiteId != req.params.campsiteId)
                favorite.save()
                    .then(favorite => {
                        res.statusCode = 200
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite)
                    })
                    .catch(err => next(err))
            })
            .catch(err => next(err))
    });



module.exports = favoriteRouter;