// import express, { Request, Response } from 'express';
// import bodyParser from 'body-parser';
// import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.json());

// interface Submission {
//     name: string;
//     email: string;
//     phone: string;
//     github_link: string;
//     stopwatch_time: string;
// }

// // MongoDB connection details
// const uri = 'YOUR_CLUSTER_URI_HERE';
// const client = new MongoClient(uri);

// let db: Db;
// let submissionsCollection: Collection<Submission>;

// client.connect()
//     .then(() => {
//         db = client.db('slidelydb'); // Replace 'yourDatabaseName' with your actual database name
//         submissionsCollection = db.collection<Submission>('submissions');
//         console.log('Connected to MongoDB');
//     })
//     .catch((err) => {
//         console.error('Error connecting to MongoDB', err);
//     });

// // Ping endpoint
// app.get('/ping', (req: Request, res: Response) => {
//     res.send(true);
// });

// // Submit endpoint
// app.post('/submit', async (req: Request, res: Response) => {
//     try {
//         const { name, email, phone, github_link, stopwatch_time } = req.body;

//         if (!name || !email || !phone || !github_link || !stopwatch_time) {
//             return res.status(400).send('Missing required fields');
//         }

//         const submission: Submission = { name, email, phone, github_link, stopwatch_time };

//         await submissionsCollection.insertOne(submission);
//         res.send('Submission saved successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

// // Read endpoint
// app.get('/read', async (req: Request, res: Response) => {
//     try {
//         const submissions = await submissionsCollection.find().toArray();
//         res.send(submissions);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

// // Delete endpoint
// app.delete('/delete/:id', async (req: Request, res: Response) => {
//     try {
//         const id = req.params.id;

//         const result = await submissionsCollection.deleteOne({ _id: new ObjectId(id) });

//         if (result.deletedCount === 0) {
//             return res.status(404).send('Submission not found');
//         }

//         res.send('Submission deleted successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

// // Search endpoint
// app.get('/search/:field/:value', async (req: Request, res: Response) => {
//     const field = req.params.field.toLowerCase();
//     const value = decodeURIComponent(req.params.value.toLowerCase());
//     try {
//         const query = { [field]: value };
//         const results = await submissionsCollection.find(query).toArray();
//         res.json(results);
//     } catch (error) {
//         console.error('Error querying MongoDB:', error);
//         res.status(500).send('Error querying MongoDB');
//     }
// });


// // Update endpoint
// app.put('/edit/:id', async (req: Request, res: Response) => {
//     try {
//         const id = req.params.id;
//         const { name, email, phone, github_link, stopwatch_time } = req.body;

//         const updatedSubmission: Partial<Submission> = { name, email, phone, github_link, stopwatch_time };

//         const result = await submissionsCollection.updateOne(
//             { _id: new ObjectId(id) },
//             { $set: updatedSubmission }
//         );

//         if (result.matchedCount === 0) {
//             return res.status(404).send('Submission not found');
//         }

//         res.send('Submission updated successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
