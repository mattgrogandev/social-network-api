const { User, Thought, Reaction } = require("../models");

module.exports = {
  // GET all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // GET single user by its _id w/ populated thought & friend data

  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user);
      })
      .catch((err) => res.status(500).json(err));
  },

  // POST a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // POST a new friend
  addFriend(req, res) {
    User.updateOne(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } }
      // { runValidators: true, new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // PUT to update a user by its _id

  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // DELETE to remove user by its _id
  deleteUser(req, res) {
    User.findOneAndDelete({
      _id: req.params.userId,
    })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.status(200).json(res)
      )
      .then(() => res.json({ message: "User deleted!" }))
      .catch((err) => res.status(500).json(err));
  },

  // POST a new friend
  removeFriend(req, res) {
    User.updateOne(
      { _id: req.params.userId },
      { $pullAll: { friend: [req.params.friendId] } }
      // { runValidators: true, new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
};
