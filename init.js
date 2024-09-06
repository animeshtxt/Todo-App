const mongoose = require('mongoose');

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/todo") ; 
};

main()
.then((res) => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err)
});

let now = new Date();
let hours = now.getHours();
let minutes = now.getMinutes();
let seconds = now.getSeconds();

console.log(`${hours}:${minutes}:${seconds}`); // Outputs the current time in HH:MM:SS format



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

let allUsers = [
    {
        name: "Tony Stark",
        email: "tony@gmail.com",
        password: "Tonystark123"
    },
    {
        name: "Bruce Banner",
        email: "bruce@gmail.com",
        password: "Brucebanner123"
    },
    {
        name: "Steve Rogers",
        email: "steve@gmail.com",
        password: "Steverogers123"
    }
]

let allTodo = [
    {
        email: "tony@gmail.com",
        task: "Buy Burj Khalifa",
        deadline: "18:00"

    },
    {
        email: "tony@gmail.com",
        task: "Dinner",
        deadline: "20:00"

    },
    {
        email: "bruce@gmail.com",
        task: "Smash Loki",
        deadline: "6:00"

    },
    {
        email: "bruce@gmail.com",
        task: "Smash Thanos",
        deadline: "22:00"

    },
    {
        email: "steve@gmail.com",
        task: "Shave",
        deadline: "8:00 "

    },
    {
        email: "steve@gmail.com",
        task: "Dance with Peggy",
        deadline: "22:00"

    }
]





// User.insertMany(allUsers);
// Todo.insertMany(allTodo);

const initDB = async () => {
    await User.deleteMany({});
    await User.insertMany(allUsers);
    await Todo.deleteMany({});
    await Todo.insertMany(allTodo);
    
    console.log("Data was initialised");

};

initDB();

