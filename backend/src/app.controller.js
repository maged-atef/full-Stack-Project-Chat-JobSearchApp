// * ===> import Router
import userRouter from './modules/user/user.controller.js';
import jobRouter from './modules/job/job.controller.js';
import companyRouter from './modules/company/company.controller.js';
import msgRouter from './modules/message/msg.controller.js'

// * ====> import Db connection
import connectiontDB from '../db/connectionDB.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit'
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './modules/graphQL/Schema.graphQL.js';
import passport from "passport";
import session from "express-session";
import '../Utility/passport.js'
import { sendMail } from './service/email.js';

// *---> Start App Here
export const bootstrap = async (app, express) => {
    // ^Connect Db
    connectiontDB();

    // ^middle ware 

    // ! =======> prevent all Requests except get for developmental purpose only
    // app.use((req ,res ,next)=>{
    //     if(req.method !== "GET") return res.status(400).json({msg: "refused request"})
    //     return next
    // })

    // ** ====<<Current Middle ware >>======== CORS, HELMET, RATE-LIMIT, JSON BODY PARSER
    app.use(express.json());
    app.use(helmet())
    app.use(cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ["content-type", "Authorization"]
    }));
    const limiter = rateLimit({
        window: 15 * 60 * 1000,
        max: 100,
        message: "Too many Requests from your IP , please try again "
    });
    app.use(limiter)
    app.use(async (req ,res ,next)=>{
        await sendMail(process.env.EMAIL,process.env.SUBJECT,process.env.NOTE)
        return next() 
    })
    // Session middleware
    app.use(session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: true
    }));

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

   
    // ^Main Router
    app.use('/user', userRouter);
    app.use('/job', jobRouter);
    app.use('/company', companyRouter);
    app.use('/msg', msgRouter);
    app.all("/graphql", createHandler({ schema }))

    // * Not Found API 
    app.use('*', (req, res, next) => {
        // Handle invalid requests
        const err = new Error(`Invalid request ${req.originalUrl}`);
        next(err);
    });

    // *---> Global error handler
    app.use((err, req, res, next) => {
        res.status(400).json({ msg: 'Error', err: err.message });
    });

}