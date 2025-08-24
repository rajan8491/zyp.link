import 'dotenv/config';
import app from './app.js';


app.listen(process.env.PORT || 4000, '0.0.0.0', () => {
    console.log(`Server is running at PORT : ${process.env.PORT}`)
})