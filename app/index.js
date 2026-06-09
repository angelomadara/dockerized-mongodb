const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI || 'mongodb://admin:VaultTecSecurePass123@mongodb:27017/?authSource=admin&replicaSet=rs0';
const client = new MongoClient(uri);

async function startApp() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Replica Set');
    } catch (e) {
        console.error('Initial connection error:', e);
    }
}
startApp();

app.get('/health', (req, res) => res.send('Sighting check: App is alive.'));

app.post('/transaction', async (req, res) => {
    const session = client.startSession();
    try {
        const results = await session.withTransaction(async () => {
            const db = client.db('atomic_test');
            
            await db.collection('accounts').updateOne(
                { account: 'A' }, 
                { $set: { balance: 100 } }, 
                { upsert: true, session }
            );
            
            await db.collection('accounts').updateOne(
                { account: 'B' }, 
                { $set: { balance: 200 } }, 
                { upsert: true, session }
            );

            return { status: 'Success', message: 'Atomic update complete' };
        });
        res.json(results);
    } catch (e) {
        console.error('Transaction aborted:', e);
        res.status(500).json({ error: 'Transaction failed', details: e.message });
    } finally {
        await session.endSession();
    }
});

app.listen(3000, () => console.log('Atomic App running on port 3000'));
