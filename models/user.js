const db = require('../db');

// FIXME Falta documentacion en todos los metodos

class User {
  constructor({
    id, name, email, password,
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static async getAll(page = 0) {
    const pageSize = parseInt(process.env.PAGE_SIZE, 10);
    const response = [];
    try {
      const data = await db.select('users', { isDeleted: false }, [page * pageSize, pageSize]);

      data.forEach((row) => {
        response.push(new User(row));
      });
    } catch (err) {
      throw err;
    }
    return response;
  }

  static async get(id) {
    let data;
    try {
      data = await db.select('users', { id, isDeleted: false }, [1]);
    } catch (err) {
      throw err;
    }
    return data.length !== 0 ? new User(data[0]) : [];
  }

  static async create({ name, email, password }) {
    let response;
    try {
      response = await db.insert('users', { name, email, password });
    } catch (err) {
      throw err;
    }
    const id = response.insertId;
    if (id > 0) {
      return new User({
        id, name, email, password,
      });
    }
    return [];
  }

  async update(keyVals) {
    let updatedRows;
    try {
      const results = await db.advUpdate('users', keyVals, { id: this.id });
      updatedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return updatedRows > 0;
  }

  static async delete(id) {
    let deletedRows;
    try {
      const results = await db.advUpdate('users', { isDeleted: true }, { id, isDeleted: false });
      deletedRows = results.affectedRows;
    } catch (err) {
      throw err;
    }
    return deletedRows > 0;
  }
}

module.exports = User;
