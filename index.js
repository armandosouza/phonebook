require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

const Person = require("./models/person")

morgan.token('content', function (request, response) { return JSON.stringify(request.body) })

//middlewares
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :http-version - :response-time ms :content'))
app.use(cors())

//get all persons
app.get('/api/persons', (request, response) => {
	Person.find({}).then(people => {
		response.json(people)
	})
})

//get info about persons
app.get('/info', (request, response) => {
	const date = new Date()
	Person.find({}).then(people => {
		response.send(`
			<p>Phonebook has info for ${people.length} people</p>
			<p>${date}</p>
		`)
	})
})

//get unique person
app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id)
	.then(result => {
		if(!result) {
			return response.status(404).end()
		}
		response.status(200).json(result)
	})
	.catch(error => {
		next(error)
	})
})

//add a new person
app.post('/api/persons', (request, response, next) => {
	const person = request.body

	const newPerson = new Person({
		name: person.name,
		number: person.number,
	})

	newPerson.save()
		.then(savedPerson => {
			response.json(savedPerson)
		})
		.catch(error => {
			next(error)
		})
})

//update person
app.put('/api/persons/:id', (request, response) => {
	const person = request.body

	Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true})
	.then(updatedPerson => {
		response.json(updatedPerson)
	})
	.catch(error => {
		next(error)
	})
})

//delete unique person
app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
	.then(result => {
		response.status(204).end()
	})
	.catch(error => {
		next(error)
	})
})

//unknown endpoint
const unknownEndpoint = (request, response) => {
	response.status(404).send({
		error: 'unknown endpoint'
	})
}

app.use(unknownEndpoint)

//errors handler
const errorHandler = (error, request, response, next) => {
	console.error(`Error: ${error}`)

	if(error.name === 'CastError') {
		return response.status(400).json({ error: 'malformatted id' })
	} else if(error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Servidor rodando em: http://localhost:${PORT}`)
})