const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [1, 'Username must be at least 1 character long'],
        maxlength: [50, 'Username must be at most 50 characters long']
      },
      name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        minlength: [1, 'First name must be at least 1 character long'],
        maxlength: [50, 'First name must be at most 50 characters long']
      }
      ,
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email is not valid'],
        maxlength: [100, 'Email must be at most 100 characters long']
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        maxlength: [128, 'Password must be at most 128 characters long'],
        select: false
      },
      image: {
        type: String, // Stores the URL or path to the image
        required: false // Set to `true` if you want to make it a required field
      },
    hisaabs:[{ type: mongoose.Schema.Types.ObjectId, ref: "hisaab" }]
})


module.exports = mongoose.model("user",userSchema);