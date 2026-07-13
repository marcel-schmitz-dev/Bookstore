import { books as initialBooks } from './scripts/data.js';
import * as templates from './scripts/templates.js';

let books = JSON.parse(localStorage.getItem('myBookstoreData')) || initialBooks;
let showOnlyFavorites = false;
let pendingDelete = { bIdx: null, cIdx: null }; 

function saveData() {
    localStorage.setItem('myBookstoreData', JSON.stringify(books));
}

document.addEventListener('click', (event) => {
    const target = event.target;
    
    if (target.id === 'confirm-yes') {
        handleDeleteComment(pendingDelete.bIdx, pendingDelete.cIdx);
        document.getElementById('confirm-modal').style.display = 'none';
        return; 
    }
    if (target.id === 'confirm-no') {
        document.getElementById('confirm-modal').style.display = 'none';
        return;
    }

    const actionKey = Object.keys(actions).find(key => 
        target.id?.startsWith(key) || target.classList.contains(key)
    );
    
    if (actionKey) {
        const index = target.id?.split('-')[1] || target.getAttribute('data-book');
        const cIdx = target.getAttribute('data-comment');
        actions[actionKey](index, cIdx);
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const target = event.target;
        
        if (target.id && target.id.startsWith('input-')) {
            const index = target.id.split('-')[1];
            handleComment(index);
        }
    }
});

const actions = {
    'show-all': () => { showOnlyFavorites = false; renderBooks(); },
    'show-favs': () => { showOnlyFavorites = true; renderBooks(); },
    'send': (idx) => handleComment(idx),
    'like': (idx) => handleLike(idx),
    'fav': (idx) => handleFavorite(idx),
    'delete-btn': (bIdx, cIdx) => { 
        pendingDelete = {bIdx, cIdx}; 
        document.getElementById('confirm-modal').style.display = 'flex'; 
    }
};

function renderBooks() {
    const container = document.getElementById('book-container');
    container.innerHTML = ""; 

    for (let i = 0; i < books.length; i++) {
        if (!showOnlyFavorites || books[i].isFavorite) {
            container.innerHTML += templates.createBookCardHTML(books[i], i);
        }
    }
}

function handleComment(index) {
    const input = document.getElementById(`input-${index}`);
    if (input && input.value.trim() !== "") {
        books[index].comments.push({ name: "Du", comment: input.value });
        saveData();
        
        const commentContainer = document.getElementById(`comments-${index}`);
        if (commentContainer) {
            commentContainer.innerHTML = `<h4>Kommentare:</h4>` + templates.getUpdatedCommentsHTML(books[index], index);
        }
        input.value = ""; 
    }
}

function handleDeleteComment(bIdx, cIdx) {
    books[bIdx].comments.splice(cIdx, 1);
    saveData();
    
    const commentContainer = document.getElementById(`comments-${bIdx}`);
    if (commentContainer) {
        commentContainer.innerHTML = `<h4>Kommentare:</h4>` + templates.getUpdatedCommentsHTML(books[bIdx], bIdx);
    }
}

function handleLike(index) {
    books[index].liked = !books[index].liked;
    books[index].likes += books[index].liked ? 1 : -1;
    saveData();
    renderBooks(); 
}

function handleFavorite(index) {
    books[index].isFavorite = !books[index].isFavorite;
    saveData();
    renderBooks();
}

renderBooks();