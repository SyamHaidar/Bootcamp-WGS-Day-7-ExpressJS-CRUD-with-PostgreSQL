const db = require('../config/database')

// -----------------------------------------------------------------------------

const getAllContact = async () => {
  const contacts = await db.query('SELECT * FROM contact')
  return contacts.rows
}

const getContactName = async (name) => {
  try {
    const contacts = await getAllContact()
    const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase())
    return contact
  } catch (error) {
    console.log(error.message)
  }
}

const saveContact = async (name, mobile, email) => {
  try {
    await db.query(`INSERT INTO contact values ('${name}','${mobile}','${email}') RETURNING *`)
  } catch (error) {
    console.log(error.message)
  }
}

const updateContact = async (oldName, name, mobile, email) => {
  try {
    await db.query(
      `UPDATE contact SET name = '${name}', mobile = '${mobile}', email = '${email}' WHERE name = '${oldName}'`
    )
  } catch (error) {
    console.log(error.message)
  }
}

const deleteContact = async (name) => {
  try {
    await db.query(`DELETE FROM contact WHERE name = '${name}'`)
  } catch (error) {
    console.log(error.message)
  }
}

module.exports = { getAllContact, getContactName, saveContact, updateContact, deleteContact }
