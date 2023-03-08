class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}


class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');

        //create tr element
        const row = document.createElement('tr');

        row.className = 'book-item';

        //insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        //create div
        const div = document.createElement('div');

        //add class
        div.className = `alert ${className}`;

        //add text
        div.appendChild(document.createTextNode(message));

        //get parent
        const container = document.querySelector('.container');

        //get form
        const form = document.querySelector('#book-form');

        //insert alert
        container.insertBefore(div, form);

        //timeout after 3sec.
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    //deleting entire row
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }

    //filter books
    filterBooks(e){
        const text = e.target.value.toLowerCase();
    
        const items = document.querySelectorAll('.book-item');

        console.log(items);
        console.log(text);

        items.forEach(function(item){
            const bookName = item.textContent;

            console.log(bookName);

            if(bookName.toLowerCase().indexOf(text) != -1){
                item.style.display = 'table-row';
            }else{
                item.style.display = 'none';
            }
        });
    }
}

class Store{
    static getBooks(){
        let books;

        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI();

            //add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

document.addEventListener('DOMContentLoaded', Store.displayBooks);

//adding books on form submission
document.getElementById('book-form').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

        const book = new Book(title, author, isbn);
        const ui = new UI();

        if(title === '' || author === '' || isbn === ''){
            ui.showAlert('Please fill in all the fields', 'error');
        }else{
            ui.addBookToList(book);
            ui.showAlert('Book added', 'success');

            //added book to LS
            Store.addBook(book);

            ui.clearFields();
        }


    e.preventDefault();
});

//removing individual row of single book items
document.getElementById('book-list').addEventListener('click', function(e){
    const ui = new UI();

    ui.deleteBook(e.target);

    ui.showAlert('Book removed', 'warning');

    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
});


//filtering books
document.getElementById('filter').addEventListener('keyup', function(e){
    const ui = new UI();

    ui.filterBooks(e);
});

