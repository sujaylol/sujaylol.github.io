const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

const dataFile = 'views.json';
let data = { views: 0, ips: [] };

// Load existing data if file exists
if (fs.existsSync(dataFile)) {
  data = JSON.parse(fs.readFileSync(dataFile));
}

app.get('/views', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  if (!data.ips.includes(ip)) {
    data.ips.push(ip);
    data.views++;
    fs.writeFileSync(dataFile, JSON.stringify(data));
  }

  res.json({ views: data.views });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
