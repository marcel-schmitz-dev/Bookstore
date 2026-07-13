export function createMetaSection(book) {
    return `
        <div class="book-meta">
            <p><strong>Autor:</strong> ${book.author}</p>
            <p><strong>Jahr:</strong> ${book.publishedYear} | <strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Preis:</strong> ${book.price.toFixed(2)} €</p>
        </div>
    `;
}

export function createCommentSection(book, bookIndex) {
    let commentsHTML = "";
    if (book.comments.length > 0) {
        commentsHTML = book.comments.map((c, cIdx) => createSingleComment(c, bookIndex, cIdx)).join('');
    } else {
        commentsHTML = '<p>Keine Kommentare vorhanden.</p>';
    }
    return `<div class="comment-section" id="comments-${bookIndex}"><h4>Kommentare:</h4>${commentsHTML}</div>`;
}

export function createSingleComment(c, bIdx, cIdx) {
    return `
        <div class="comment-item">
            <p><b>${c.name}:</b> ${c.comment}</p>
            <button class="delete-btn" data-book="${bIdx}" data-comment="${cIdx}">X</button>
        </div>
    `;
}

export function createActionSection(book, index) {
    let likeClass = "";
    if (book.liked) {
        likeClass = "liked";
    }

    let favSymbol = "☆";
    let favClass = "";
    if (book.isFavorite) {
        favSymbol = "★";
        favClass = "active-fav";
    }

    return `
        <div class="actions">
            <span class="like-btn ${likeClass}" id="like-${index}" style="cursor:pointer;">♥ ${book.likes}</span>
            <span class="fav-btn ${favClass}" id="fav-${index}" style="cursor:pointer;">${favSymbol}</span>
        </div>
    `;
}

export function createInputSection(index) {
    return `
        <div class="input-area">
            <input type="text" id="input-${index}" placeholder="Kommentar...">
            <button id="send-${index}">Senden</button>
        </div>
    `;
}

export function getUpdatedCommentsHTML(book, bookIndex) {
    if (book.comments.length > 0) {
        return book.comments.map((c, cIdx) => createSingleComment(c, bookIndex, cIdx)).join('');
    } else {
        return '<p>Keine Kommentare vorhanden.</p>';
    }
}

export function createBookCardHTML(book, index) {
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