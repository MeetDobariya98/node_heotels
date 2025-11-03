const express = require('express');
const router = express.Router();
const Person = require('./../models/person'); // Capitalized model name
const { jwtAuthMiddleware, generateToken } = require('./../jwt');



// POST route to add a person
router.post('/signup', async (req, res) => {
    try {
        const data = req.body;

        // Create a new person document using the Mongoose model
        const newPerson = new Person(data);

        // Save the new person
        const response = await newPerson.save();
        console.log('Data saved successfully');

        const payload={
            id:response.id,
            username:response.username
        }
        const token=generateToken(payload)
        console.log("token is : ",token);
        console.log("payload is : ",payload);
        
        res.status(200).json({response: response,token: token});
    } 
    catch (err) {
        console.error('Error saving person:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//loging router
router.post('/login',async(req,res)=>{
    try{
        //extract username and password from request body
        const {username,password}=req.body;

        //find the user by username
        const user =await Person.findOne({username: username});

        //if user does not exits or password does not matc,return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"invalid username or password"})
        }

        //generate tokens
        const payload={
            id:user.id,
            username:user.username
        }
        const token=generateToken(payload)

        //return token as response
        res.json({token})
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:"invalid server error"})
    }
})

//profile routs
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData=req.user;
        console.log("user data : ",userData);
        
        const userId=userData.id;
        const user =await Person.findById(userId);

        res.status(200).json({user})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"})
    }
})

// GET route to fetch all persons
router.get('/',jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log('Data fetched successfully');
        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await Person.find({ work: workType });
            console.log('response fetched');
            res.status(200).json(response);
        }
        else {
            res.status(404).json({ error: "invalid server error" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//post method
router.put('/:id',async(req,res)=>{
    try{
        const personId=req.params.id;
        const updatedPersonData=req.body; //updated data for the person

        const response=await Person.findByIdAndUpdate(personId,updatedPersonData,{
            new:true, //return the updated document
            runValidators:true, //run momgoose validation
        })

        if(!response){
             return res.status(404).json({error:"person not found"})
        }
        console.log("data updated");
        res.status(200).json(response)
    }
    catch{
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

//delete 
router.delete('/:id',async(req,res)=>{
    try{
        const personId=req.params.id;

        const response=await Person.findByIdAndDelete(personId);
         if(!response){
             return res.status(404).json({error:"person not found"})
        }
        console.log("data deleted");
        res.status(200).json({message:"person deleted successfully"})
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;