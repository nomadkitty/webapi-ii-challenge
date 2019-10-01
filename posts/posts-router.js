const express = require("express");

const db = require("../data/db");

const router = express.Router();

// GET to all posts
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// GET posts by id
router.get("/:id", (req, res) => {
  const id = req.params.id;

  db.findById(id)
    .then(post => {
      if (!post.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

// GET comments by id
router.get("/:id/comments", (req, res) => {
  const id = req.params.id;

  db.findPostComments(id)
    .then(comments => {
      if (!comments.length) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(comments);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

// POST a post
router.post("/", (req, res) => {
  const postData = req.body;
  if (!postData.title || !postData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.insert(postData)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the post to the database",
        });
      });
  }
});

// POST a comment to a id
router.post("/:id/comments", (req, res) => {
  const commentData = req.body;
  const id = req.params.id;

  db.findById(id).then(post => {
    console.log(post);
    if (!post.length) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    } else {
      if (!commentData.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        db.insertComment(commentData)
          .then(comment => {
            res.status(201).json(comment);
          })
          .catch(err => {
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database",
            });
          });
      }
    }
  });
});

// DELETE a post
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(post => {
      if (!post) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

// PUT a post
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const postData = req.body;
  if (!postData.title || !postData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post.",
    });
  } else {
    db.update(id, postData)
      .then(post => {
        if (!post) {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        } else {
          res.status(200).json(post);
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: "The post information could not be modified." });
      });
  }
});

module.exports = router;
