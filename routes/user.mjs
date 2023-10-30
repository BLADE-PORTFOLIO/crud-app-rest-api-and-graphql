import express from "express";
import User from "../models/user.model.js";

const userRouter = express.Router();

userRouter.get("/user", async (req, res) => {
    const users = await User.find();
    console.log(users);
    res.send(users).status(200);
});

userRouter.get("/user/:id", async (req, res) => {
    const user = await User.findById(req.params.id).toArray();

    if (!user) res.send("Not found").status(404);
    else res.send(user).status(200);
});

userRouter.post("/user", async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        permissions: req.body.permissions,
    });
    await newUser.save();
    res.send(newUser).status(204);
});

userRouter.put("/user/:id", async (req, res) => {
    const { id: _id } = args;
    await User.findByIdAndUpdate(_id, { name: args.name, permissions: args.permissions }, { new : false});
    const result = await User.findById(_id);

    res.send(result).status(200);
});

userRouter.delete("/user/:id", async (req, res) => {
    try {
        const user = await User.findOneAndDelete({_id: args.id});
        res.send(user).status(200);
    } catch (err) {
        const user = new User({name: "Null", permissions: []});
        res.send(user).status(200);
    }
});

export default userRouter;