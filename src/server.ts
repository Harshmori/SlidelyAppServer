import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path'; // Import path module to handle file paths
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
interface Submission {
    name: string;
    email: string;
    phone: string;
    github_link: string;
    stopwatch_time: string;
    }

// Define the path to db.json based on the current file location
const dbPath = path.resolve(__dirname, 'db.json');

// Ping endpoint
app.get('/ping', (req: Request, res: Response) => {
    res.send(true);
});

// Submit endpoint
app.post('/submit', (req: Request, res: Response) => {
    try {
        const { name, email, phone, github_link, stopwatch_time } = req.body;

        if (!name || !email || !phone || !github_link || !stopwatch_time) {
            return res.status(400).send('Missing required fields');
        }

        // Read the current submissions
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }

            const submissions = JSON.parse(data);
            submissions.push({ name, email, phone, github_link, stopwatch_time });

            // Write the updated submissions back to the JSON file
            fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to database');
                }

                res.send('Submission saved successfully');
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Read endpoint
app.get('/read', (req: Request, res: Response) => {
    try {
        // Read the current submissions
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }

            const submissions = JSON.parse(data);
            res.send(submissions);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Delete endpoint
app.delete('/delete/:id', (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        // Read the current submissions
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }

            const submissions = JSON.parse(data);

            // Find the index of the submission with the given id
            const index = parseInt(id); // Convert id to integer

            if (isNaN(index) || index < 0 || index >= submissions.length) {
                return res.status(404).send('Submission not found');
            }

            // Remove the submission at the found index
            submissions.splice(index, 1);

            // Write the updated submissions back to the JSON file
            fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to database');
                }

                res.send('Submission deleted successfully');
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


// Search endpoint
app.get('/search/:field/:value', (req: Request, res: Response) => {
    const field = req.params.field.toLowerCase();
    const value = req.params.value.toLowerCase();
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database');
        }

        try {
            const submissions: Submission[] = JSON.parse(data);

            // Filter submissions based on the field and value
            const results = submissions.filter(submission =>
                submission[field as keyof Submission].toLowerCase() === value
            );

            res.json(results);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).send('Error parsing JSON');
        }
    });
});

// Update endpoint
app.put('/edit/:index', (req: Request, res: Response) => {
    try {
        const index = req.params.index;
        const { name, email, phone, github_link, stopwatch_time } = req.body;

        // Read the current submissions
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }

            let submissions = JSON.parse(data);

            // Update the submission at the specified index
            submissions[index] = { name, email, phone, github_link, stopwatch_time };

            // Write the updated submissions back to the JSON file
            fs.writeFile(dbPath, JSON.stringify(submissions, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to database');
                }

                res.send('Submission updated successfully');
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
