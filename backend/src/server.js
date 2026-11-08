const app = require('./app');
const { port } = require('./config');

app.listen(port, () => {
  console.log(`Ape Para backend listening on port ${port}`);
});
