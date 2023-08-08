const mongoose = require("mongoose")
const url = process.env.MONGODB_URI

mongoose.set("strictQuery", false)

console.log("connecting...")

mongoose.connect(url)
	.then(result => {
		console.log("connected to MongoDB")
	})
	.catch(error => {
		console.log("error connecting to MongoDB: ", error.message)
})


const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true
	},
	number: {
		type: String,
		validate: {
			validator: function (val) {
				return /(\d\d|\d\d\d)[-]?(\d)+/.test(val)
			}
		},
		required: true,
		minLength: 8
	}
})


personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model("Person", personSchema)