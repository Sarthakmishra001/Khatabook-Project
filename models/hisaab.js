const mongoose = require('mongoose');

const hisaabSchema = mongoose.Schema({
 title:{
    type: 'string',
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title must be at least 1 character long'],
    maxlength: [50, 'Title must be at most 50 characters long']
 },
 description:{
type: 'string',
    required: [true, 'Description is required'],
    trim: true,
 },
 user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"user"
 },
 encrypted:{   
    type: 'boolean',
    default: false
 },
 shareable:{
    type: 'boolean',
    default: false
 },
 passcode: {
    type: 'string',
    default: ""
 },
editpermissions: {
    type: 'boolean',
    default: false
},



},
{timestamps: true}
);

module.exports = mongoose.model("hisaab",hisaabSchema);

// ensure createdAt is indexed (timestamps: true adds createdAt)
hisaabSchema.index({ createdAt: 1 });
