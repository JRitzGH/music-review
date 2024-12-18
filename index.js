require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const { DBLINK } = require('./key.js');

const express=require('express');
const path=require('path');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const bcrypt=require('bcryptjs');
const mongoose=require('mongoose');

const app=express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates'));

const uri = DBLINK;

mongoose.connect(uri)
    .then(() => console.log('Connected to DB'))
    .catch((err) => console.log(err));

const User = require('./src/User');

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', authMiddleware, (req, res) => {
    res.render('home', { name: req.cookies.userInfo });
});

function authMiddleware(req, res, next) {
    const token = req.cookies.authToken;
    const userToken = req.cookies.userInfo;
    if (!token || !userToken) return res.redirect('/login');

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid Token');
        req.user = decoded;
        next();
    });
}

//app.get('/dashboard', authMiddleware, (req, res) => {
//    res.send('Welcome to the dashboard!');
//});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usernameLower = username.toLowerCase();
    const user = await User.findOne({ userLower: usernameLower });

    if (!user) {
        return res.render('login', { error: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.render('login', { error: 'Invalid Credentials' });
    }

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h'});

    res.cookie('authToken', token, { httpOnly: true });
    res.cookie('userInfo', username, { httpOnly: true });

    res.redirect('/');
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const usernameLower = username.toLowerCase();

    const existingUser = await User.findOne({ userLower: usernameLower });

    if (existingUser) {
        return res.render('signup', {error: 'Username already taken.'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username: username, userLower: usernameLower, password: hashedPassword });

    await newUser.save();
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.clearCookie('userInfo');
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});