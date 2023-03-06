require('dotenv').config();
const { Router } = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../utils/connect.js');
const jwt = require('jsonwebtoken');

module.exports = Router().post('/signup', async (req, res, next) => {
    const { email, password } = req.body;

    const password_hash = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS) || 7
    );

    const { rows } = await pool.query(
        `
        INSERT INTO users (email, password_hash)
        VALUES ($1, $2)
        RETURNING *;

    `,
        [email, password_hash]
    );

    const user = rows[0];

    delete user.password_hash;

    const token = jwt.sign({ ...user }, process.env.APP_Secret, {
        expiresIn: '24h',
    });

    const ONE_DAY = 1000 * 60 * 60 * 24;

    res.cookie('session', token, {
        httpOnly: true,
        maxAge: ONE_DAY,
        sameSite: 'none',
        secure: true,
    });

    res.send(user);
});
