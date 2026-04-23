const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
const reservationsRouter = require('./routes/reservations');
const adminRouter = require('./routes/admin');
const { loginUser, createUser } = require('./controllers/userController');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/admin', adminRouter);
app.post('/api/login', loginUser);
app.post('/api/register', createUser);

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
