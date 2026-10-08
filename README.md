# Syntecxhub_Notes_App

A simple and clean notes app built with **React** as part of the **Syntecxhub Web Development Virtual Internship**. You can add, edit and delete notes, and they stay saved even after you refresh the page.

## Screenshot

![Notes App](./screenshot.png)

## Live Demo

[View the app](https://syntecxhub-notes-app-six.vercel.app)

## Features

- Add, edit and delete notes
- Search notes as you type
- Note count (for example, "2 of 3 notes")
- Date and time shown on each note
- Confirmation popup before deleting
- Light and dark mode (your choice is remembered)
- Notes saved in the browser using localStorage
- Responsive design for mobile and desktop

## React Concepts Used

| Concept | Where it is used |
|---|---|
| `useState` | Manages the notes list, input text, search text and theme |
| `useRef` | Focuses the input field on load and after add or edit |
| `useEffect` | Saves notes and theme to localStorage, and applies the theme |
| `localStorage` | Keeps notes and theme across sessions |

## Tech Stack

- React
- Vite
- CSS (custom properties for light and dark themes)

## Run Locally

```bash
git clone https://github.com/sumlamusthafa/Syntecxhub_Notes_App.git
cd Syntecxhub_Notes_App
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Author

**MM Fathima Sumla**
Web Development Intern at [Syntecxhub](https://www.syntecxhub.com)