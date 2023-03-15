const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.json());

const musicians = [
  {id: 1, name: 'James Wilf', album: 'saviour' },
  {id: 2, name: 'John Doe', album: 'Comfortor' },
  {id: 3, name: 'Dorse Moew', album: 'Bible in hand' },
  {id: 4, name: 'Mild Cat', album: 'Emmanuel' },
];

////////////////////// GET HTTP REQUEST //////////////////////
app.get('/', (req, res) => {
  res.send(`The is the Home Page`)
});

app.get('/api/musicians', (req, res) => {
  res.send(musicians)
});

app.get('/api/musicians/:id', (req, res) => {
  const musician = musicians.find(m => m.id === parseInt(req.params.id));
  if(!musician) return res.status(404).send(`Musician with the ID ${req.params.id} not found`)
  return res.send(musician)
})

///////////////////////////// POST HTTP REQUEST ////////////////////////////////////
app.post('/api/musicians', (req, res) =>{
  const {error, value} = validateFunc(req.body);
  if(error) return res.status(400).send(error.details[0].message)

  const musician = {
    id: musicians.length + 1,
    name: req.body.name,
    album: req.body.album
  } 

  musicians.push(musician);
  res.send(musician)
})

app.put('/api/musicians/:id', (req, res) => {
  // iterarate and find the musician Id
  const musician = musicians.find(m => m.id === parseInt(req.params.id))
  if(!musician) return res.status(404).send(`The musician with the ID ${req.params.id} is not found`)

  const {error, value} = validateFunc(req.body);
  if(error) return res.send(error.details[0].message)

  // If found, update
  musician.name = req.body.name
  musician.album = req.body.album

  res.send(musician)
})

const validateFunc = (parameter) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    album: Joi.string().min(3).required()
  })

  return Joi.validate(parameter, schema)
}

app.delete("/api/musicians/:id", (req, res) => {
  const musician = musicians.find(m => m.id === parseInt(req.params.id));
  if(!musician) return res.status(404).send(`The musician with Id ${req.params.id} not found`)
  
  const index = musicians.indexOf(musician)
  musicians.splice(index, 1)

  res.send(musician)
})


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening to port ${port}...`));