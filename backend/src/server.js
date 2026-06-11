import app from './app.js';
import config from './config/index.js';

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`);
});
