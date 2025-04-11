const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};

module.exports = async (req, res) => {
  // ✅ Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const { orderId, customerRating, comments } = req.body;

  if (!orderId || !customerRating) {
    return res.status(400).send('Missing required fields');
  }

  try {
    await sql.connect(config);
    await sql.query`
      INSERT INTO FeedbackResponses (OrderID, CustomerRating, Comments)
      VALUES (${orderId}, ${customerRating}, ${comments})
    `;
    res.status(200).send('Feedback submitted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving feedback');
  }
};
