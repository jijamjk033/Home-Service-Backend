import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve(__dirname, "../../logs");
const logFileName = path.resolve(logDirectory, "req.log");
console.log("Log Directory:", logDirectory);
console.log("Log File Name:", logFileName);

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
    console.log("Log directory created");
}

const accessLogStream = fs.createWriteStream(logFileName, { flags: 'a' });

const morganMiddleware = morgan('combined', { stream: accessLogStream });

export default morganMiddleware;
