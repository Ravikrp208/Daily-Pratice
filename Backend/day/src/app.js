const express = require ("express")

const app=express ()

//middleware to read json body
app.use(express.json())
const notes =[]

//home route
app.get("/ " ,(req, res) =>{
  res.send("hello wolrd")
})


//POST /notes  {title: "sample title", description: "sample description"}
app.post ("/notes",(req,res)=>{
  console.log(req.body)
  notes.push(req.body)
  console.log(notes)
  res.send("notes is created")
})

/* GET /notes */

app.get("/notes", (req,res)=>{
  res.send(notes)
})


/* DELETE /notes/:index  */
app.delete("/notes/:index",(req,res)=>{
     console.log(req.params.index)
     console.log("note deleted successfully")
})
/* PATCH /notes/:index  */
/* req.body ={description :- "sample modified description "} */
app.patch("/notes/:index",(req, res)=>{
  notes[req.params.index].description =req.body.description
  notes[req.params.index].title =req.body.title
  res.send("Note updated successfully")
})


module.exports= app