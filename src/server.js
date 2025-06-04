const express = require('express');
const app = express();
const PORT = 3000;

//serve public files
const path = require('path')
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/hello', (req, res) => {
  res.json({message: "this is a message from your server."})
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
