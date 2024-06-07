const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const newRoommate = async () => {
    try {
        const { data } = await axios.get("https://randomuser.me/api")
        const randomRoommate = data.results[0];
        
        const roommate = {
                id: uuidv4().slice(0, 6),
                nombre: `${randomRoommate.name.first} ${randomRoommate.name.last}`,
                debe: 0,
                recibe: 0,
        };
        
        const { roommates } = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));
        
        roommates.push(roommate);
        
        fs.writeFileSync("Roommates.json", JSON.stringify({ roommates }, null, 2));

        return roommates;
    } catch (error) {
        console.log("No se ha podido agregar al roommate.")
    }
};

const updateCuentas = () => {
    try {
        const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));
        const roommatesJSON = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));
        const cantidadRoommates = roommatesJSON.roommates.length;

        let gastoTotal = 0;

        for (const gasto of gastosJSON.gastos) {
            gastoTotal += gasto.monto;
        }

        const gastoPorRoommate = gastoTotal / cantidadRoommates;

        for (const roommate of roommatesJSON.roommates) {
            roommate.debe = 0;
            roommate.recibe = 0;
        }

        for (const gasto of gastosJSON.gastos) {
            const roommateQueGasto = roommatesJSON.roommates.find(r => r.nombre === gasto.roommate);
            const montoPorRoommate = gasto.monto / cantidadRoommates;

            for (const roommate of roommatesJSON.roommates) {
                if (roommate.nombre !== gasto.roommate) {
                    roommate.debe += montoPorRoommate;
                } else {
                    roommate.recibe += montoPorRoommate * (cantidadRoommates - 1);
                }
            }
        }

        fs.writeFileSync("Roommates.json", JSON.stringify(roommatesJSON, null, 2));

        console.log(`Cuentas actualizadas con éxito. Gasto por roommate: ${gastoPorRoommate}`);
        return gastoPorRoommate;
    } catch (error) {
        console.error(`Error actualizando cuentas: ${error.message}`);
        return null;
    }
};

const updateCuentasOnDelete = (id) => {
    try {
        const gastosJSON = JSON.parse(fs.readFileSync("Gastos.json", "utf-8"));
        const roommatesJSON = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));

        const gastos = gastosJSON.gastos;
        const roommates = roommatesJSON.roommates;
        const cantidadRoommates = roommates.length;

        const gastoEliminado = gastos.find((g) => g.id === id);
        if (!gastoEliminado) {
            throw new Error(`Gasto con ID ${id} no encontrado`);
        }

        const gastoEliminadoPorRoommate = gastoEliminado.monto / cantidadRoommates;

        for (const roommate of roommates) {
            roommate.debe = Math.max(0, roommate.debe - gastoEliminadoPorRoommate);
        }

        const roommateQueGasto = roommates.find(r => r.nombre === gastoEliminado.roommate);
        if (roommateQueGasto) {
            roommateQueGasto.recibe = Math.max(0, roommateQueGasto.recibe - (gastoEliminadoPorRoommate * (cantidadRoommates - 1)));
        }

        fs.writeFileSync("Roommates.json", JSON.stringify({ roommates }, null, 2));

        console.log(`Cuentas actualizadas tras eliminar el gasto con ID ${id}`);
    } catch (error) {
        console.error(`Error actualizando cuentas: ${error.message}`);
    }
};

module.exports = { newRoommate, updateCuentas, updateCuentasOnDelete}