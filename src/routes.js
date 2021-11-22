const express = require('express')
const routes = express.Router()
const data = require('./data.json')
const recipes = require('./controllers/recipes')

routes.get('/', (req, res) => {
  return res.render('home', { recipes: data.recipes })
})
routes.get('/about', (req, res) => {
  return res.render('about')
})
routes.get('/recipes', (req, res) => {
  return res.render('recipes', { recipes: data.recipes })
})
routes.get('/recipes/:id', (req, res) => {
  const { id } = req.params
  return res.render('info', { recipe: data.recipes[id] })
})

/* ADMIN */

routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes')
})

routes.get('/admin/recipes', recipes.index) // Mostrar a lista de receitas
routes.get('/admin/recipes/create', recipes.create) // Mostrar formulário de nova receita
routes.get('/admin/recipes/:id', recipes.show) // Exibir detalhes de uma receita
routes.get('/admin/recipes/:id/edit', recipes.edit) // Mostrar formulário de edição de receita

routes.post('/admin/recipes', recipes.post) // Cadastrar nova receita
routes.put('/admin/recipes', recipes.put) // Editar uma receita
routes.delete('/admin/recipes', recipes.delete) // Deletar uma receita

module.exports = routes