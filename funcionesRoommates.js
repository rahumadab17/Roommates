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
                debe: "",
                recibe: "",
        };
        
        const { roommates } = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));
        
        roommates.push(roommate);
        
        fs.writeFileSync("Roommates.json", JSON.stringify({ roommates }));

        return roommates;
    } catch (error) {
        console.status(500);
    }
};

const updateCuentas = async () => {
    try {
        const { roommates } = JSON.parse(fs.readFileSync("Roommates.json", "utf-8"));

        


    } catch (error) {
        console.status(500);
    }
}

module.exports = { nuevoRoommate, updateCuentas}