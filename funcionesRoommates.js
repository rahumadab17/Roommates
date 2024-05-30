const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const nuevoRoommate = async () => {
    try {
        const { data } = await axios.get("https://randomuser.me/api")
        const randomRoommate = data.results[0];
        
        const roommate = {
                id: uuidv4().slice(0, 6),
                nombre: `${randomRoommate.name.first} ${randomRoommate.name.last}`,
                debe: calculoDebe(),
                recibe: totalRecibe(),
        };
        
        const { roommates } = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));
        
        roommates.push(roommate);
        
        fs.writeFileSync("Roommates.json", JSON.stringify({ roommates }));

        return roommates;
    } catch (error) {
        console.log("No se ha podido agregar al roommate.")
    }
};

const totalRecibe = () => {

    const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));

    let gastoTotal = 0;

    for (const gasto of gastosJSON.gastos) {
        gastoTotal += gasto.monto;
    }

    return gastoTotal;
  };

const calculoDebe = (gastoTotal) => {

  const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));

  const cantidadRoommates = gastosJSON.length();

  const result= gastoTotal / cantidadRoommates;

  return result;
  }

module.exports = { nuevoRoommate }