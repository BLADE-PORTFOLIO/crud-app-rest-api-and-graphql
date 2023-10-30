import express from "express";
import User from "../models/user.model.js";
import Book from "../models/book.model.js";

const bookRouter = express.Router();

bookRouter.get("/book", async (req, res) => {
    const books = await Book.find();
    res.send(books).status(200);
});
  
bookRouter.get("/book/:id", async (req, res) => {
    const book = await Book.findById(req.params.id).toArray();

    if (!book) res.send("Not found").status(404);
    else res.send(book).status(200);
});

bookRouter.post("/book", async (req, res) => {
    const newBook = new Book({
        title: req.body.title,
        author: req.body.author,
    });
    await newBook.save();
    const object = {
        id: newBook._id,
        title: req.body.title,
    }
    const user = await User.findById(req.body.author)
    object["author"] = user
    res.send(object).status(204);
});

bookRouter.put("/book/:id", async (req, res) => {
    const { id: _id } = req.params;
    await Book.findByIdAndUpdate(_id, {title: req.body.title, author: req.body.author}, { new : false});
    const result = await Book.findById(_id);
    delete result.author;
    const user = await User.findById(req.body.author)
    result["author"] = user;
  
    res.send(result).status(200);
});

bookRouter.delete("/book/:id", async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({_id: req.body.id});
        const id = book.author
        delete book.author
        const user = await User.findById(id);
        book["author"] = user;
        res.send(book).status(200);
    } catch (err) {
        const book = new Book({title: "Null", author: "Null"});
        res.send(book).status(200);
    }
});

export default bookRouter;