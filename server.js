const fastify = require('fastify')({ logger: true })
const { MongoClient } = require('mongodb')
const bcrypt = require('bcrypt')
const path = require('path')
const fastifyView = require('@fastify/view')
const formbody = require('@fastify/formbody')
fastify.register(formbody)
require('dotenv').config()


// MongoDB connection URI
const uri = process.env.MONGO_URI
const dbName = process.env.DB_NAME
const collectionName = process.env.COLLECTION_NAME

let db, usersCollection

async function start() {
  const client = new MongoClient(uri)
  await client.connect()
  fastify.log.info('Connected to MongoDB')

  db = client.db(dbName)
  usersCollection = db.collection(collectionName)

  // Register view plugin
  fastify.register(fastifyView, {
    engine: {
      ejs: require('ejs')
    },
    root: path.join(__dirname, 'views')
  })

  // Serve register page
  fastify.get('/register', (request, reply) => {
    reply.view('register.ejs', { error: null })
  })

  // Handle register form submission
  fastify.post('/register', async (request, reply) => {
    const { username, password } = request.body
    if (!username || !password) {
      return reply.view('register.ejs', { error: 'Username and password required' })
    }

    const existingUser = await usersCollection.findOne({ username })
    if (existingUser) {
      return reply.view('register.ejs', { error: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await usersCollection.insertOne({ username, password: hashedPassword })

    return reply.view('success.ejs', { message: 'Registration successful! You can now login.' })
  })

  // Serve login page
  fastify.get('/login', (request, reply) => {
    reply.view('login.ejs', { error: null })
  })

  // Handle login form submission
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body
    if (!username || !password) {
      return reply.view('login.ejs', { error: 'Username and password required' })
    }

    const user = await usersCollection.findOne({ username })
    if (!user) {
      return reply.view('login.ejs', { error: 'Invalid username or password' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return reply.view('login.ejs', { error: 'Invalid username or password' })
    }

    return reply.view('success.ejs', { message: 'Login successful!' })
  })

  try {
    await fastify.listen({ port: 3000,host: '0.0.0.0'  })
    console.log('Server listening on http://localhost:3000')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
