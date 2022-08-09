# GraphQL Sandbox

## Try the following requests

Get all the books
```
query GetBooks {
  books {
    author
    title
  }
}
```

Get a book by id
```
query {
  book(id: 1) {
    title
    author
  }
}
```

Add a new book
```
mutation addBook {
  addBook(title: "The Dispossesed 3", author: "Ursula Le Guin") {
    title
    author
  }
}
```


Update an existing book with variables
```
mutation UpdateBook($updateBookId: ID!, $bookInput: UpdateBookInput!) {
  updateBook(id: $updateBookId, input: $bookInput) {
    title
    author
  },
}


{
  "updateBookId": "1",
  "bookInput": {
    "author": "Joe Joe",
    "title": "hello"
  }
}
```