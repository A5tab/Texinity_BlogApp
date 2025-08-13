import {app} from './app.js';
import connectDB from './db/index.js';

const PORT_NO = process.env.PORT_NO;
connectDB()
    .then(() => {
        app.listen(PORT_NO, () => {
            console.log(`Server is running on port ${PORT_NO}`);
        })
        app.on("error", err => console.log("Error in running the server:: ",err));
    }) 
    .catch((error) => {
        console.log("Error in connecting to the database:: ",error);
        process.exit(1);
    })