const db = require('../../config/db')
const fs = require('fs')

module.exports = {
  create({ filename, path }) {
    try {
      const query = `
    INSERT INTO files (
      name, path
    ) VALUES ($1, $2)
    RETURNING id
  `

      const values = [filename, path]

      return db.query(query, values)
    } catch (err) {
      console.error(err)
    }
  },
  insertRecipeFile(fileId, recipeId) {
    try {
      const query = `
      INSERT INTO recipe_files (
        recipe_id, file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

      const values = [recipeId, fileId]

      return db.query(query, values)
    } catch (err) {
      console.error(err)
    }
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
  findFileById(id) {
    try {
      return db.query('SELECT * FROM files WHERE id = $1', [id])
    } catch (error) {
      console.error(error)
    }
  }
}