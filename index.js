// implement your API here
const express = require('express');
const Data = require('./data/db.js');
const port = 5000;
const server = express();
// teaches express how to read JSON from the body
server.use(express.json());// needed for POST and PUT/PATCH

//Post
server.post(`/api/users`, (req, res) => {
    const newUser = req.body;
    
    if(newUser.name && newUser.bio){
        Data.insert(newUser)
            .then(user => {
                res.status(201).json(user)
    })
    .catch(err => {
        console.log(err)
        res.status(400).json({ errorMessage: "There was an error while saving the user to the database"})
    })
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }
});

//Get request with .find
server.get(`/api/users`, (req, res) => {

    Data.find().then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
    console.log(err)
    res.status(500).json({errorMessage: "The users information could not be retrieved."})
    })
})
// If the _user_ with the specified `id` is not found:

// - respond with HTTP status code `404` (Not Found).
// - return the following JSON object: `{ message: "The user with the specified ID does not exist." }`.
//Get request with id passed in with .find
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    
    Data.findById(id)
        .then(found => {
            if(found){
                res.status(200).json(found)
            } else {
                res.status(404).json({message: "The user with the specified ID does not exist."})
            };
    }).catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "The user information could not be retrieved." })
    });
    
})

//Delete
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Data.remove(id)
    .then(found => {
        if(found){
            res.status(200).json(found)
        } else {
            res.status(404).json({message: "The user with the specified ID does not exist." })
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "The user could not be removed"})
    })
})

//Put request
server.put('/api/users/:id', (req, res) => {
    const editUser = req.body;

    if(editUser.name && editUser.bio){
        Data.update(editUser.id, editUser)
            .then(user => {
                if(user){
                    res.status(201).json(user)
                } else {
                    res.status(404).json({
                        message: "The user with the specified ID does not exist"
                    })
                }
               
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The user information could not be modified."})
    })
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }
})

server.listen(port, () => console.log(`Server on port ${port}`))
