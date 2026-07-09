import { books as initialBooks } from './data.js';

let books = JSON.parse(localStorage.getItem('myBookstoreData')) || initialBooks;
let showOnlyFavorites = false;

function saveData() {
    localStorage.setItem('myBookstoreData', JSON.stringify(books));
}

function createMetaSection(book) {
    return `
        <div class="book-meta">
            <p><strong>Autor:</strong> ${book.author}</p>
            <p><strong>Jahr:</strong> ${book.publishedYear} | <strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Preis:</strong> ${book.price.toFixed(2)} €</p>
        </div>
    `;
}

function createCommentSection(book, bookIndex) {
    const commentsHTML = book.comments.length > 0 
        ? book.comments.map((c, cIdx) => createSingleComment(c, bookIndex, cIdx)).join('') 
        : '<p>Keine Kommentare vorhanden.</p>';
    return `<div class="comment-section" id="comments-${bookIndex}"><h4>Kommentare:</h4>${commentsHTML}</div>`;
}

function createSingleComment(c, bIdx, cIdx) {
    return `
        <div class="comment-item">
            <p><b>${c.name}:</b> ${c.comment}</p>
            <button class="delete-btn" data-book="${bIdx}" data-comment="${cIdx}">X</button>
        </div>
    `;
}

function createActionSection(book, index) {
    return `
        <div class="actions">
            <span class="like-btn ${book.liked ? 'liked' : ''}" id="like-${index}" style="cursor:pointer;">♥ ${book.likes}</span>
            <span class="fav-btn ${book.isFavorite ? 'active-fav' : ''}" id="fav-${index}" style="cursor:pointer;">
                ${book.isFavorite ? '★' : '☆'}
            </span>
        </div>
    `;
}

function createInputSection(index) {
    return `
        <div class="input-area">
            <input type="text" id="input-${index}" placeholder="Kommentar...">
            <button id="send-${index}">Senden</button>
        </div>
    `;
}

function createBookCardHTML(book, index) {
    return `
        <div class="book-card" id="card-${index}">
            <h2>${book.name}</h2>
            <img src="./assets/img/${book.image}" alt="${book.name}" class="book-cover">
            ${createMetaSection(book)}
            ${createActionSection(book, index)}
            ${createCommentSection(book, index)}
            ${createInputSection(index)}
        </div>
    `;
}

function attachEventListeners(index) {
    document.getElementById(`like-${index}`).addEventListener('click', () => handleLike(index));

    document.getElementById(`send-${index}`).addEventListener('click', () => handleComment(index));

    document.getElementById(`fav-${index}`).addEventListener('click', () => handleFavorite(index));

    const inputField = document.getElementById(`input-${index}`);
    inputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleComment(index);
        }
    });

    const deleteButtons = document.querySelectorAll(`#card-${index} .delete-btn`);
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => handleDeleteComment(
            e.target.getAttribute('data-book'), 
            e.target.getAttribute('data-comment')
        ));
    });
}

function handleLike(index) {
    books[index].liked = !books[index].liked;
    books[index].likes += books[index].liked ? 1 : -1;
    saveData();
    renderBooks();
}

function handleComment(index) {
    const input = document.getElementById(`input-${index}`);
    if (input.value.trim() !== "") {
        books[index].comments.push({ name: "Du", comment: input.value });
        saveData();
        renderBooks();
    }
}

function handleFavorite(index) {
    books[index].isFavorite = !books[index].isFavorite;
    saveData();
    renderBooks();
}

function handleDeleteComment(bIdx, cIdx) {
    if (confirm("Möchtest du diesen Kommentar wirklich löschen?")) {
        books[bIdx].comments.splice(cIdx, 1);
        saveData();
        renderBooks();
    }
}

function renderBooks() {
    const container = document.getElementById('book-container');

    const filteredBooks = showOnlyFavorites 
        ? books.filter(book => book.isFavorite) 
        : books;

    container.innerHTML = books.map((book, index) => {
        if (showOnlyFavorites && !book.isFavorite) return '';
        return createBookCardHTML(book, index);
    }).join('');
    
    books.forEach((_, index) => attachEventListeners(index));
}

document.getElementById('show-all-btn').addEventListener('click', () => {
    showOnlyFavorites = false;
    renderBooks();
});

document.getElementById('show-favs-btn').addEventListener('click', () => {
    showOnlyFavorites = true;
    renderBooks();
});

renderBooks();