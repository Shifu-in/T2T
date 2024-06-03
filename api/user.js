import { Client } from 'pg';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

export default async function handler(req, res) {
  const { method } = req;
  if (method === 'POST') {
    const { userId, username, balance, upgrades, tapPower, autoRate } = req.body;
    const query = `
      INSERT INTO users (userId, username, balance, upgrades, tapPower, autoRate)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (userId) DO UPDATE
      SET username = $2, balance = $3, upgrades = $4, tapPower = $5, autoRate = $6
    `;
    const values = [userId, username, balance, upgrades, tapPower, autoRate];
    try {
      await client.query(query, values);
      res.status(200).json({ message: 'User data saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (method === 'GET') {
    const { userId } = req.query;
    try {
      const result = await client.query('SELECT * FROM users WHERE userId = $1', [userId]);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
