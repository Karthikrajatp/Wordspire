var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var session = require("express-session");
var app = express();

app.use(
  session({
    secret: "12345678",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/blogapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var port = 420;
app.use(express.static("./public/"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/public/signup.html");
});
var userSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: false,
  },
  userEmail: {
    type: String,
    unique: true,
  },
  userAltEmail: {
    type: String,
    unique: true,
  },
  userPhoneNo: {
    type: String,
    unique: false,
  },
  userPassword: {
    type: String,
    unique: false,
  },
});
var postSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: false,
  },
  postTitle: {
    type: String,
    unique: false,
  },
  postCategory: {
    type: String,
    unique: false,
  },
  postContent: {
    type: String,
    unique: false,
  },
});
var User = mongoose.model("User", userSchema);
var Post = mongoose.model("Post", postSchema);
app.post("/signup", (req, res) => {
  var user = new User({
    userName: req.body.name,
    userEmail: req.body.email,
    userAltEmail: req.body.aemail,
    userPhoneNo: req.body.phonenumber,
    userPassword: req.body.password,
  });
  user
    .save()
    .then((item) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.send(
        "<script>alert('Unable to SignUp!!'); window.location.href = '/signup';</script>"
      );
    });
});
app.post("/create", (req, res) => {
  var post = new Post({
    username: req.body.username,
    postTitle: req.body.title,
    postContent: req.body.content,
    postCategory: req.body.category,
  });
  post
    .save()
    .then((item) => {
      res.send(
        "<script>alert('Blog Created!!'); window.location.href = '/home';</script>"
      );
    })
    .catch((err) => {
      res.send(
        "<script>alert('Unable to create post!!'); window.location.href = '/home';</script>"
      );
    });
});
app.get("/home", (req, res) => {
  if (req.session.user) {
    var user = req.session.user;
    res.sendFile(__dirname + "/public/main.html", { user: user });
  } else {
    res.redirect("/");
  }
});
app.post("/", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({ userEmail: email, userPassword: password })
    .then((user) => {
      if (user) {
        req.session.user = user;
        res.redirect("/home");
      } else {
        res.send(
          "<script>alert('Invalid credentials'); window.location.href = '/';</script>"
        );
      }
    })
    .catch((err) => {
      res.send(
        "<script>alert('An error occurred during login'); window.location.href = '/';</script>"
      );
    });
});
app.get("/posts", async(req,res)=>{
    try{
        await Post.find({}).then((posts)=>{
        res.status(200).json({data:posts});
        }).catch((error)=>{
        console.log(error);
        })
    }catch(err){
        console.log(err);
    }
})
app.get("/searchresults", async (req, res) => {
  try {
    var searchTerm = req.query.term;
    console.log(searchTerm);
    await Post.find({
      $or: [
        { username: { $regex: searchTerm, $options: "i" } },
        { postTitle: { $regex: searchTerm, $options: "i" } },
        { postCategory: { $regex: searchTerm, $options: "i" } },
        { postContent: { $regex: searchTerm, $options: "i" } },
      ],
    })
      .then((posts) => {
        res.status(200).json({ data: posts});
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
