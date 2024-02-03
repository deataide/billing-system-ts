import express from 'express'
import 'dotenv/config'
import router from './config/routes';
import cors from 'cors'

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(router)

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    if(req) next()
    return res.status(404).json({ message: "Endpoint not found" });
  });
  
app.listen(port, ()=>{
    console.log(`Working on port ${port}`)
})
