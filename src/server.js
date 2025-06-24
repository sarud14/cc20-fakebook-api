import dotenv from "dotenv"
import app from "./app.js"


dotenv.config()

const PORT = process.env.PORT || 8899
app.listen(PORT, ()=>{
  console.log(`server is running @ ${PORT}`)
})