const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const RecipeController = require('../app/controllers/RecipeController')
const {
  onlyRightUserOrAdmin,
  onlyAdmin
} = require('../app/middlewares/session')

routes.get('/', RecipeController.index) // Mostrar a lista de receitas
routes.get('/create', RecipeController.create) // Mostrar formulário de nova receita
routes.get('/:id', RecipeController.show) // Exibir detalhes de uma receita
routes.get('/:id/edit', onlyRightUserOrAdmin, RecipeController.edit) // Mostrar formulário de edição de receita
routes.post('/', multer.array('photos', 5), RecipeController.post) // Cadastrar nova receita
routes.put(
  '/',
  multer.array('photos', 5),
  onlyRightUserOrAdmin,
  RecipeController.put
) // Editar uma receita
routes.delete('/', RecipeController.delete) // Deletar uma receita

module.exports = routes
