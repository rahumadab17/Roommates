const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { nuevoRoommate } = require('./nuevoRoommate.js');

const app = express();
const port = 3000;

app.listen(port, console.log(`Servidor ON escuchando en puerto ${port}`))

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/roommate", async (req, res) => {
    res.send(nuevoRoommate());
});

app.get("/roommates", (req, res) => {
    const roommatesJSON = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));

    res.send(roommatesJSON);
});

app.get("/gastos", async (req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));

    res.send(gastosJSON);
})

app.post("/gasto", async (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;

        const gasto = { id: uuidv4().slice(0, 6), roommate, descripcion, monto }

        const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));

        const gastos = gastosJSON.gastos;

        gastos.push(gasto);

        fs.writeFileSync("Gastos.json", JSON.stringify(gastosJSON));

        res.send("Gasto agregado con éxito");
    }
    catch {
        res.status(500).send("Algo salió mal")
    }
});

app.put("/gasto", (req, res) => {
    try {
        const { id } = req.query;
        const { roommate, descripcion, monto } = req.body;
    
        const gasto = { id, roommate, descripcion, monto }

        const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));

        const gastos = gastosJSON.gastos;

        gastosJSON.gastos = gastos.map((g) => g.id === id ? gasto : g);
        
        fs.writeFileSync("Gastos.json", JSON.stringify(gastosJSON));

        updateDebeRecibe(id, monto);
        res.send("Gasto modificado con éxito");
    }
    catch {
        res.status(500).send("Algo salió mal")
    }
})

app.delete("/gasto", (req, res) => {
    try {
        const { id } = req.query;

        const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));

        const gastos = gastosJSON.gastos;

        gastosJSON.gastos = gastos.filter((g) => g.id !== id);

        fs.writeFileSync("Gastos.json", JSON.stringify(gastosJSON));

        res.send("Gasto eliminado con éxito");
    }
    catch {
        res.status(500).send("Algo salió mal")
    }
});