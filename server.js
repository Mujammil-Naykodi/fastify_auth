const fastify = require('fastify')({ logger: true });
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const path = require('path');
const fastifyView = require('@fastify/view');
const formbody = require('@fastify/formbody');
require('dotenv').config();

fastify.register(formbody);

// PostgreSQL Pool
const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT || 5432,
});

pgPool.on('connect', () => {
  fastify.log.info(' Connected to PostgreSQL');
});

// View engine setup
fastify.register(fastifyView, {
  engine: {
    ejs: require('ejs'),
  },
  root: path.join(__dirname, 'views'),
});

// GET /register
fastify.get('/register', (req, reply) => {
  reply.view('register.ejs', { error: null });
});

// POST /register
fastify.post('/register', async (req, reply) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return reply.view('register.ejs', { error: 'Username and password required' });
  }

  const existing = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (existing.rows.length > 0) {
    return reply.view('register.ejs', { error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pgPool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

  return reply.view('success.ejs', { message: 'Registration successful! You can now login.' });
});

// GET /login
fastify.get('/login', (req, reply) => {
  reply.view('login.ejs', { error: null });
});

// POST /login
fastify.post('/login', async (req, reply) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return reply.view('login.ejs', { error: 'Username and password required' });
  }

  const result = await pgPool.query('SELECT * FROM users WHERE username = $1', [username]);
  if (result.rows.length === 0) {
    return reply.view('login.ejs', { error: 'Invalid username or password' });
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return reply.view('login.ejs', { error: 'Invalid username or password' });
  }

  return reply.view('success.ejs', { message: 'Login successful!' });
});

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log(' Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
