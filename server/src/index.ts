import express, { Express } from "express";
import { list, load, save, scorelist, grade } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.get("/api/load", load);
app.get("/api/list", list);
app.get("/api/scorelist", scorelist);
app.post("/api/save", save);
app.post("/api/grade", grade);
app.listen(port, () => console.log(`Server listening on ${port}`));
