const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Search page
app.get('/search', (req, res) => {
  res.sendFile(__dirname + '/public/search.html');
});

// Recommendation page
app.get('/recommendation', (req, res) => {
  res.sendFile(__dirname + '/public/recommendation.html');
});

// book1 page
app.get('/book1', (req, res) => {
  res.sendFile(__dirname + '/public/book1.html');
});

// book2 page
app.get('/book2', (req, res) => {
  res.sendFile(__dirname + '/public/book2.html');
});

// book3 page
app.get('/book3', (req, res) => {
  res.sendFile(__dirname + '/public/book3.html');
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//Search page
const books = [
  { title: 'Book 1', author: 'Author 1', year: 2021, genre: 'Fantasy', rating: 4.5 },
  { title: 'Book 2', author: 'Author 2', year: 2022, genre: 'Mystery', rating: 3.8 },
  { title: 'Book 3', author: 'Author 3', year: 2020, genre: 'Science Fiction', rating: 4.2 }
];

