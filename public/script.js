document.addEventListener('DOMContentLoaded', () => {
    const noteForm = document.getElementById('noteForm');
    const noteContent = document.getElementById('noteContent');
    const notesList = document.getElementById('notesList');
  
    // Fetch notes from the server
    async function fetchNotes() {
      const response = await fetch('/api/notes');
      const notes = await response.json();
      notesList.innerHTML = ''; // Clear the existing notes
      notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
          <p>${note.content}</p>
          <button onclick="deleteNote('${note.id}')">Delete</button>
          <button onclick="editNote('${note.id}')">Edit</button>
        `;
        notesList.appendChild(noteDiv);
      });
    }
  
    // Add a new note
    noteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const content = noteContent.value.trim();
      if (content) {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        noteContent.value = '';
        fetchNotes(); // Reload the notes
      }
    });
  
    // Delete a note
    window.deleteNote = async (id) => {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      fetchNotes(); // Reload the notes
    };
  
    // Edit a note
    window.editNote = async (id) => {
      const content = prompt('Edit your note:');
      if (content) {
        await fetch(`/api/notes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        });
        fetchNotes(); // Reload the notes
      }
    };
  
    fetchNotes(); // Initial load of notes
  });
  