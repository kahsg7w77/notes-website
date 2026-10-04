const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesContainer = document.getElementById("notesContainer");

let notes = [];
let editIndex = -1;

// Load notes from notes.txt through server
async function loadNotes() {
    const response = await fetch("/api/notes");
    notes = await response.json();
    displayNotes();
}

// Save notes to notes.txt through server
async function saveNotes() {
    await fetch("/api/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(notes)
    });
}

// Create / Update Note
async function addNote() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title === "" || content === "") {
        alert("Please enter both title and note.");
        return;
    }

    if (editIndex === -1) {
        notes.push({
            title: title,
            content: content
        });
    } else {
        notes[editIndex].title = title;
        notes[editIndex].content = content;
        editIndex = -1;
    }

    await saveNotes();

    titleInput.value = "";
    contentInput.value = "";

    displayNotes();
}

// Display notes
function displayNotes() {
    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {
        const noteDiv = document.createElement("div");

        noteDiv.className = "note";

        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>

            <button class="edit-btn" onclick="editNote(${index})">
                Edit
            </button>

            <button class="delete-btn" onclick="deleteNote(${index})">
                Delete
            </button>
        `;

        notesContainer.appendChild(noteDiv);
    });
}

// Edit note
function editNote(index) {
    titleInput.value = notes[index].title;
    contentInput.value = notes[index].content;

    editIndex = index;
}

// Delete note
async function deleteNote(index) {
    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (confirmDelete) {
        notes.splice(index, 1);

        await saveNotes();

        displayNotes();
    }
}

// Load saved notes when website opens
loadNotes();