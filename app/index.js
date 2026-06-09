const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());

const uri = process.env.MONGO_URI || 'mongodb://admin:VaultTecSecurePass123@mongodb:27017/?authSource=admin&replicaSet=rs0';
const client = new MongoClient(uri);

async function startApp() {
    const maxRetries = 10;
    const retryDelay = 3000;

    for (let i = 0; i < maxRetries; i++) {
        try {
            await client.connect();
            console.log('Connected to MongoDB Replica Set');
            app.listen(3000, () => console.log('Atomic App running on port 3000'));
            return;
        } catch (e) {
            console.error(`Connection attempt ${i + 1}/${maxRetries} failed:`, e.message);
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
    }
    console.error('Failed to connect to MongoDB after multiple retries. Exiting.');
    process.exit(1);
}

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

startApp();
