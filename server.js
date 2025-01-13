import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB  from './config/mongodb.js';
import connectCloudinary from './config/cloudnary.js';
import adminRouter from './routes/adminRoute.js';


const app = express();



const PORT = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());



// api endpoints
app.use('/api/admin',adminRouter); 


app.get('/', (req, res) => {
    res.send('API testing');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});