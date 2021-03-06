const db = require('../../config/db')
const { date } = require('../../lib/utils')
const File = require('../models/File')

module.exports = {
  all() {
    try {
      return db.query(`
      SELECT recipes.id, recipes.title, chefs.name AS chef_name 
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      ORDER BY recipes.created_at DESC
    `)
    } catch (err) {
      console.error(err)
    }
  },
  async create(data) {
    try {
      const query = `
      INSERT INTO recipes (
        chef_id,
        user_id,
        title,
        ingredients,
        preparation,
        information
      ) VALUES ($1,${data.user_id}, $2, '{${data.ingredients}}', '{${data.preparation}}', $3)
      RETURNING id
    `

      const values = [data.chef_id, data.title, data.information]

      const results = await db.query(query, values)
      return results.rows[0].id
    } catch (error) {
      console.error(error)
    }
  },
  find(id) {
    try {
      return db.query(
        `
      SELECT recipes.*, chefs.name AS chef_name FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `,
        [id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  findBy(search) {
    try {
      return db.query(
        `
        SELECT recipes.id, recipes.title, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${search}%'
        ORDER BY recipes.updated_at DESC
      `
      )
    } catch (error) {
      console.error(error)
    }
  },
  update(data) {
    try {
      const query = `
      UPDATE recipes SET
        chef_id = ($1),
        title = ($2),
        ingredients = ('{${data.ingredients}}'),
        preparation = ('{${data.preparation}}'),
        information = ($3)
      WHERE id = $4
    `

      const values = [data.chef_id, data.title, data.information, data.id]

      return db.query(query, values)
    } catch (error) {
      console.error(error)
    }
  },
  getChefsToSelectOptions() {
    /* db.query(`SELECT * FROM chefs`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    }) */
    try {
      return db.query(`SELECT * FROM chefs`)
    } catch (error) {
      console.error(error)
    }
  },
  delete(id) {
    try {
      return db.query(
        `
        DELETE FROM recipes WHERE id = $1
      `,
        [id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  getRecipeFiles(recipe_id) {
    try {
      return db.query(
        `
          SELECT * FROM files
          LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
          WHERE recipe_files.recipe_id = $1
        `,
        [recipe_id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  async getFirstImageOfRecipe(id) {
    try {
      let results = await db.query(
        `SELECT file_id FROM recipe_files WHERE recipe_id = $1`,
        [id]
      )

      return await File.findFileById(results.rows[0].file_id)
    } catch (error) {
      console.error(error)
    }
  },
  async getUserIdOfRecipe(recipe_id) {
    try {
      let query = `
      SELECT user_id FROM recipes WHERE id = ${recipe_id}
    `
      let results = await db.query(query)

      return results.rows[0].user_id
    } catch (error) {
      console.error(error)
    }
  }
}
