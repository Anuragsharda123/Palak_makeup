import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import session from "express-session";
import passport from "passport";
import userRoutes from './routes/userRoutes';
import sequelize from './config/db';
import { Local } from './environment/env';
import './config/passport';
import User from './models/student';
import Admin from './models/admin';
import courseSubscription from './models/courseSubscription';

const app = express();
const PORT = Local.Port;

// app.use('/uploads', express.static('uploads'))

app.use(cors());

app.use(
  session({
    secret: Local.Client_Secret,
    resave: false,
    saveUninitialized: false,
  })
);

const privateKey = fs.readFileSync('localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('localhost.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(passport.initialize());
app.use(passport.session());
app.use('/resume', express.static('resume'));
app.use(express.json())
app.use('/', userRoutes);

sequelize.authenticate().then(()=>{
  courseSubscription.sync({alter: false})
    .then(() => {
      console.log('Database synchronized\n\n ');
    })
    .catch((err:any) => {
      console.error('Database synchronization failed:', err);
    });

}).catch((err:any)=>{
  console.error('Database connection failed:', err);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// https.createServer(credentials, app)
//   .listen(3000, () => {
//     console.log('HTTPS Server running on https://localhost:3000');
//   });

export default app;
