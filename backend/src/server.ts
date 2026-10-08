import dotenv from 'dotenv';
// Load environment variables before anything else
dotenv.config({ path: '../.env' }); 

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
