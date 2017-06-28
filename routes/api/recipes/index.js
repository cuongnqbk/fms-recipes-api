const express = require('express')
const router = express.Router()
const recipes = require('../../../helpers/db/recipes')

router.get('/', (req, res) => {
    recipes.getRecipes(req.query.filter)
        .then(docs => {
            res.json({ recipes: docs })
        })
        .catch(err => {
            res.json({ err: err })
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    if (!id)
        res.json({err: 'Recipe ID not supplied.'})

    recipes.getRecipeById(id)
        .then(doc => {
            res.json({ recipe: doc })
        })
        .catch(err => {
            res.json({ err: err })
        })
})

router.post('/:id/:property', (req, res) => {
    const id = req.params.id
    const property = req.params.property
    const value = req.body.value

    recipes.updateRecipeProperty(id, property, value)
        .then(result => {
            res.json({ success: true })
        })
        .catch(err => {
            res.json({ err: err })
        })
})

router.post('/:id/:property/:option', (req, res) => {
    const id = req.params.id
    const property = req.params.property
    const option = req.params.option
    const value = req.body.value
    

    recipes.updateRecipeProperty(id, property, value, option)
        .then(result => {
            res.json({ success: true })
        })
        .catch(err => {
            res.json({ err: err })
        })
})

module.exports = router
