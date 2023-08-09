const mongoose = require("mongoose")

if(process.argv.length === 5 || process.argv.length === 3) {
  const password = process.argv[2]
  const name = process.argv[3] || null
  const number = process.argv[4] || null

  const url = `mongodb+srv://multicodelab:${password}@cluster0.wg1jssh.mongodb.net/persons?retryWrites=true&w=majority`

  mongoose.set('strictQuery', false)
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  if(name || number) {
    const person = new Person({
      name, number
    })

    person.save().then(result => {
      console.log('person saved!')
      mongoose.connection.close()
    })
  } else {
    Person.find({}).then(people => {
      console.log("phonebook:")
      people.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  }
}

