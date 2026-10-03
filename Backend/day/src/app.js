
import express, { request } from "express"


const app = express()

app.use(express.json());

/* HOME PAGE :-  */

app.get("/", (req, res) => {
    res.json({ message: "Backend API Running" 

    })
}
)

export default app


