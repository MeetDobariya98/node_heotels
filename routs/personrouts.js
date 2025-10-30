const express = require('express');
const router = express.Router();
const Person = require('./../models/person'); // Capitalized model name


// POST route to add a person
router.post('/', async (req, res) => {
    try {
        const data = req.body;

        // Create a new person document using the Mongoose model
        const newPerson = new Person(data);

        // Save the new person
        const response = await newPerson.save();
        console.log('Data saved successfully');
        res.status(200).json(response);
    } catch (err) {
        console.error('Error saving person:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET route to fetch all persons
router.get('/', async (req, res) => {
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