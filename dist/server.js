"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path")); // Import path module to handle file paths
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.json());
// Define the path to db.json based on the current file location
const dbPath = path_1.default.resolve(__dirname, 'db.json');
// Ping endpoint
app.get('/ping', (req, res) => {
    res.send(true);
});
// Submit endpoint
app.post('/submit', (req, res) => {
    try {
        const { name, email, phone, github_link, stopwatch_time } = req.body;
        if (!name || !email || !phone || !github_link || !stopwatch_time) {
            return res.status(400).send('Missing required fields');
        }
        // Read the current submissions
        fs_1.default.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }
            const submissions = JSON.parse(data);
            submissions.push({ name, email, phone, github_link, stopwatch_time });
            // Write the updated submissions back to the JSON file
            fs_1.default.writeFile(dbPath, JSON.stringify(submissions, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to database');
                }
                res.send('Submission saved successfully');
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
// Read endpoint
app.get('/read', (req, res) => {
    try {
        // Read the current submissions
        fs_1.default.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }
            const submissions = JSON.parse(data);
            res.send(submissions);
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
// Delete endpoint
app.delete('/delete/:id', (req, res) => {
    try {
        const id = req.params.id;
        // Read the current submissions
        fs_1.default.readFile(dbPath, 'utf8', (err, data) => {
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
            fs_1.default.writeFile(dbPath, JSON.stringify(submissions, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to database');
                }
                res.send('Submission deleted successfully');
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
// Search endpoint
app.get('/search/:field/:value', (req, res) => {
    const field = req.params.field.toLowerCase();
    const value = req.params.value.toLowerCase();
    fs_1.default.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading database');
        }
        try {
            const submissions = JSON.parse(data);
            // Filter submissions based on the field and value
            const results = submissions.filter(submission => submission[field].toLowerCase() === value);
            res.json(results);
        }
        catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).send('Error parsing JSON');
        }
    });
});
// Update endpoint
app.put('/edit/:index', (req, res) => {
    try {
        const index = req.params.index;
        const { name, email, phone, github_link, stopwatch_time } = req.body;
        // Read the current submissions
        fs_1.default.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error reading database');
            }
            let submissions = JSON.parse(data);
            // Update the submission at the specified index
            submissions[index] = { name, email, phone, github_link, stopwatch_time };
            // Write the updated submissions back to the JSON file
            fs_1.default.writeFile(dbPath, JSON.stringify(submissions, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error writing to database');
                }
                res.send('Submission updated successfully');
            });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
