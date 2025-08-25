// Import lowdb modules
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Set up lowdb

// Here we're using users as an example, but you can store any type of data
// Let's say our user's data structure looks like this:
// { id: 1, name: 'John Doe', email: 'john@example.com' }
const defaultData = { users: [] }; 
const adapter = new JSONFile('db.json');
const db = new Low(adapter, defaultData);

// Function to initialize the database
function initializeDb() {
  return db.read()
    .then(() => {
      // If db.data is null, set it to defaultData
      if (db.data === null) {
        db.data = defaultData;
      }
      return db.write()
    })
    .then(() => {
      console.log('Database initialized')
    })
    .catch((error) => {
      console.error('Error initializing database:', error)
    })
}

// CREATE: Add a new user
function addUser(user) {
  return db.read()
    .then(() => {
      db.data.users.push(user)
      return db.write()
    })
    .then(() => {
      console.log('User added successfully')
      return user
    })
    .catch((error) => {
      console.error('Error adding user:', error)
    })
}

// READ: Get all users
function getAllUsers() {
  return db.read()
    .then(() => {
      return db.data.users
    })
    .catch((error) => {
      console.error('Error retrieving users:', error)
    })
}

// UPDATE: Update a user by ID
function updateUser(id, updatedInfo) {
  return db.read()
    .then(() => {
      const userIndex = db.data.users.findIndex(user => user.id === id)
      if (userIndex !== -1) {
        db.data.users[userIndex] = { ...db.data.users[userIndex], ...updatedInfo }
        return db.write()
      } else {
        throw new Error('User not found')
      }
    })
    .then(() => {
      console.log('User updated successfully')
      return db.data.users.find(user => user.id === id)
    })
    .catch((error) => {
      console.error('Error updating user:', error)
    })
}

// DELETE: Delete a user by ID
function deleteUser(id) {
  return db.read()
    .then(() => {
      const initialLength = db.data.users.length
      db.data.users = db.data.users.filter(user => user.id !== id)
      
      if (db.data.users.length < initialLength) {
        return db.write()
      } else {
        throw new Error('User not found')
      }
    })
    .then(() => {
      console.log('User deleted successfully')
    })
    .catch((error) => {
      console.error('Error deleting user:', error)
    })
}

// Example usage
initializeDb()
  .then(() => addUser({ id: 1, name: 'John Doe', email: 'john@example.com' }))
  .then(() => getAllUsers())
  .then(users => console.log('All users:', users))
  .then(() => updateUser(1, { name: 'Jane Doe' }))
  .then(() => deleteUser(1))
  .catch(error => console.error('Error in operations:', error))