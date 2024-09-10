const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

main()
.then(()=> {
    console.log("connection successful");
})
.catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/todo") ; 
};
let now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: `${hours}:${minutes}:${seconds}`
    }
});

const todoSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true
    },
    task: {
        type: String,
        default: "none"

    },
    deadline: {
        type: String,
        default: "23:59",
        default: "none"
    }
});

const User = mongoose.model("User", userSchema);
const Todo = mongoose.model("Todo", todoSchema);



function getIndianTime() {
    const date = new Date();
    const utcOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const indianTime = new Date(date.getTime() + utcOffset);
    return indianTime;
};



let login = false;

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/new", async (req, res) => {
    const {'new-name': name, 'new-email': email, 'new-password': password} = req.body;
    console.log(req.body);
     console.log(name+"----"+email+"---"+password);
    let newUser = new User ({
        name: name,
        email: email,
        password: password
        } 
    );

    try {
        const savedUser = await newUser.save();
        console.log(savedUser);
        console.log(email);
        res.redirect(`/post-login/${email}`);
    } 
    catch (err) {
        if (err.code === 11000) {  // duplicate error check
            res.status(400).send("Error: The email address you have entered is already in use.");
        } else {
            // other errors
            console.error(err);
            res.status(500).send("An unexpected error occurred.");
        }
    }
    
    
});


app.post("/post-login",async (req,res) => {
    const {email, password} = req.body;
    console.log(req.params);
    console.log(email+ "----" + password);

    const user = await User.findOne({email });
    if (!user) {
        return res.send('User not found.');
    } else {

        if(password === user.password){
            login = true ;
            console.log(password);
            console.log(user.password);
            res.redirect(`/post-login/${user.email}`);
        } else{
            res.send("wrong password");
        }
        
    }
});

app.get("/post-login/:email", async (req,res) => {
    let {email} = req.params ;
    const user = await User.findOne({email });
    const todo = await Todo.find({email});
    res.render("user.ejs", {todo, user});
    // console.dir(req.ip);
});

app.post("/logout" , (req, res) => {
    login = false ;
    res.redirect("/")
});

app.get("/", (req, res)=> {
    res.render("home.ejs");
});


app.post("/new/:email", (req, res) => {
    let {email} = req.params;
    let {'new-task': task, 'new-deadline': deadline } = req.body;
    console.log(email);
    console.log(task + "---"+deadline+"---");
    let newTask = [
        {
            email: email,
            task: task,
            deadline: deadline
        }
    ]
    Todo.insertMany(newTask);
    res.redirect(`/post-login/${email}`);
});


app.delete("/:email/delete/:_id", async (req, res) => {
    try {console.log(req.params._id);
      const result = await Todo.deleteOne({_id: `${req.params._id}`});
      
      if (!result) {
        return res.status(404).send('Todo not found');
      }
      res.redirect(`/post-login/${req.params.email}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting todo');
    }
    
  });

app.get("/:email/edit/:_id", async (req, res) => {
    const {email, _id} = req.params;
    console.log(email," ", _id);
    const result = await Todo.findOne({_id: `${req.params._id}`});
    res.render("edit.ejs", {result});
});

app.patch("/:email/edit/:_id", async (req, res) => {
   console.log(req.body);
   let {email, _id} = req.params;
   let {'updated-task': task, 'updated-deadline': deadline} = req.body ;
   await Todo.findOneAndUpdate({_id: _id}, {task: task, deadline: deadline});
   res.redirect(`/post-login/${email}`);

 });


app.listen(8080, () => {
    console.log("To Do List Server listening on port 8080");
})

































