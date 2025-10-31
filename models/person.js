const mongoose=require('mongoose');
const bcrypt=require('bcrypt')

//define a person schema
const personSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number
    },
    work:{
        type:String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
})

personSchema.pre('save', async function (next) {
  const person = this;

  // Only hash if password is new or modified
  if (!person.isModified('password')) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // Replace the plain text password with hashed password
    person.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Compare a candidate password with the stored hash
personSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw err;
  }
};

//create person model
const Person=mongoose.model('Person',personSchema);
module.exports=Person;