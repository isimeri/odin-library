let library = [];
const booksContainer = document.querySelector(".books-container");
let bookId = 1;

function Book(id, title, author, nrPages, isRead){
    this.id = id
    this.title = title;
    this.author = author;
    this.pages = nrPages;
    this.read = isRead;
    this.info = function (){
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read === true ? "i've read it" : "haven't read it yet"}`;
    }
}

function addBookToLibrary(){
    const title = document.querySelector("#title-input");
    const author = document.querySelector("#author-input");
    const pages = document.querySelector("#pages-input");
    const isRead = document.querySelector("#isRead-input");

    const newBook = new Book(bookId, title.value, author.value, pages.value, isRead.checked);
    bookId++;

    title.value = ``;
    author.value = ``;
    pages.value = ``;
    isRead.checked = false;

    library.push(newBook);
    refreshLibraryLight(newBook);
    saveToLocalStorage();

}

function deleteBook(bookElem){
    const bookId = bookElem.dataset.bookId;

    const bookDelIndex = library.findIndex(i => i.id === parseInt(bookId));
    library.splice(bookDelIndex, 1);
    booksContainer.removeChild(bookElem);
    saveToLocalStorage();
}

function createBookElem(bookObj, fragment){

    const bookDiv = document.createElement('div');
    const bookTitle = document.createElement('h3');
    const bookAuthor = document.createElement('h6');
    const bookPages = document.createElement('p');
    const btnDelete = document.createElement('button');

    const isReadDiv = document.createElement('div');

    isReadDiv.className = 'isRead-wrapper';
    isReadDiv.innerHTML = `
        <span>Status:</span>
        <label class="isRead-switch switch">
            <input type="checkbox" ${bookObj.read ? 'checked' : ''} class="isRead-checkbox">
            <span class="slider round"></span>
        </label>
        <span class="isRead-text">${bookObj.read ? 'Already read' : 'Not read yet'}</span>`;

    bookTitle.textContent = bookObj.title;
    bookTitle.className = 'title';
    bookAuthor.textContent = `by ${bookObj.author}`;
    bookAuthor.className = 'author';
    bookPages.textContent = `Pages: ${bookObj.pages}`
    bookPages.classList = 'pages';
    btnDelete.classList.add('btn', 'btn-delete');
    btnDelete.textContent = 'Delete';

    bookDiv.className = 'book';
    bookDiv.dataset.bookId = bookObj.id;
    bookDiv.append(bookTitle);
    bookDiv.append(bookAuthor);
    bookDiv.append(bookPages);
    bookDiv.append(isReadDiv);
    bookDiv.append(btnDelete);

    fragment.append(bookDiv);

}

function refreshLibraryLight(bookObj){
    const fragment = new DocumentFragment();

    createBookElem(bookObj, fragment);
    booksContainer.append(fragment);
}
function refreshLibraryFull(){

    const fragment = new DocumentFragment();

    library.forEach(bookObj => {
        createBookElem(bookObj, fragment);
    });

    booksContainer.innerHTML = '';
    booksContainer.append(fragment);

}

function updIsRead(isReadSwitch){

    const bookElem = isReadSwitch.closest(".book");
    const bookId = bookElem.dataset.bookId;
    const readStatus = bookElem.querySelector(".isRead-text");

    const bookUpdIndex = library.findIndex(elem => {
        return elem.id === parseInt(bookId);
    });
    
    if(isReadSwitch.checked){
        library[bookUpdIndex].read = true;
        readStatus.textContent = "Already read";
    } else {
        library[bookUpdIndex].read = false;
        readStatus.textContent = "Not read yet";
    }

    saveToLocalStorage();
}

function loadFromLocalStorage(){
    const libraryArr = localStorage.getItem("libraryArr");

    if(libraryArr){
        return JSON.parse(libraryArr);
    }
    return [];
}

function saveToLocalStorage(){
    localStorage.setItem("libraryArr", JSON.stringify(library));
}

function updBookIdFromStorage(){
    const maxId = library.reduce((acc, curr) => {
        return curr.id > acc ? curr.id : acc;
    }, 1);

    bookId = maxId + 1;
}

function init(){
    library = loadFromLocalStorage();
    if(library.length > 0){
        updBookIdFromStorage();
    }
    refreshLibraryFull();
}


const btnAdd = document.querySelector(".btn-add");

btnAdd.addEventListener("click", e => {
    e.preventDefault();
    addBookToLibrary();
});
booksContainer.addEventListener("click", e => {
    if(e.target.classList.contains("btn-delete")){
        const bookElem = e.target.closest(".book");
        deleteBook(bookElem);
    }
})
booksContainer.addEventListener("change", e => {
    if(e.target.classList.contains("isRead-checkbox")){
        // console.log(e.target);
        updIsRead(e.target);
    }
});

init();