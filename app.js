const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.js');

app.use(require('cors')());
app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 7890;

app.get('/world', (req, res) => {
    res.send({ name: 'leo' });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
