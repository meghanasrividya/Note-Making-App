const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON requests
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (HTML, CSS, JS)

// Load notes from data.json file
function loadNotes() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return []; // Return empty array if file doesn't exist or can't be read
  }
}

// Write notes to data.json file
function saveNotes(notes) {
  fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(notes, null, 2));
}

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all notes (READ)
app.get('/api/notes', (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

// Create a new note (CREATE)
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = loadNotes();
  newNote.id = Date.now().toString(); // Generate a unique ID for the note
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

// Update an existing note (UPDATE)
app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const updatedNote = req.body;
  const notes = loadNotes();
  const index = notes.findIndex(note => note.id === id);

  if (index === -1) return res.status(404).send('Note not found');

  notes[index] = { ...notes[index], ...updatedNote };
  saveNotes(notes);
  res.json(notes[index]);
});

// Delete a note (DELETE)
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  let notes = loadNotes();
  notes = notes.filter(note => note.id !== id);
  saveNotes(notes);
  res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
