const app = require('./app');
const connectDB = require('./db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});