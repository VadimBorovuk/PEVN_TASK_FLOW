require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error')

const app = express();
const PORT = process.env.PORT || 2001;
app.use(express.json())
app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
);
app.use(cookieParser())

app.use('/api', router)
app.use(errorMiddleware) // must be last in list middleware by .use()
// В контролерах в catch (e) буде передаватися помилка через next(e) яка приходить з сервісу через throw ApiError.

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../../client/dist")));
//
//   app.use((req, res, next) => {
//     if (!req.path.startsWith('/api')) {
//       res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
//     } else {
//       next();
//     }
//   });
// }

app.listen(PORT, ()=>{
  console.log(`Server on http://localhost:${PORT}`);
});
