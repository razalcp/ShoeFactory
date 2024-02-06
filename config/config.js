const mongoose=require('mongoose')

const connection =()=>{
mongoose.connect(process.env.database);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
})

mongoose.connection.on("error", (err) => {
  console.log("Error connecting to MongoDB");
})

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
})
}

module.exports={connection}