const express = require("express");
const app = express();
const fs = require("fs");
//const fetch = require("node-fetch");
const port = 8080;
//const apiRouter = require('./routes/peticiones');

app.use(express.json());

//app.use('/api', apiRouter);
app.post("/users", (req, res) => {
  const { nombre, apellido, correo } = req.body;
  const pais = req.body.pais || "Colombia";
  const ciudad = req.body.ciudad || "Bogotá";

  if (!nombre || !apellido || !correo) {
    res
      .status(400)
      .send({
        message: "Completa tus datos necesarios: nombre, apellido, correo.!",
      });
  }

  const usuario = {
    nombre,
    apellido,
    correo,
    ciudad,
    pais,
  };
  res.json(usuario);
});

//EndPoint retorna cantidad de usuarios ordenados
app.get('/users/:count', (req, res) => {
    
  //valor de la variable count de la URL
  const count = parseInt(req.params.count);

  // Valido sort existe y es válida
  const sort = req.query.sort;
  if (!sort || (sort !== 'ASC' && sort !== 'DESC')) {
      return res.status(400).json({ error: 'La variable sort debe ser ASC o DESC.' });
  }

  //Ordenar usuarios
  const jsonData = ordenarUsuarios(sort,count);
  //const nombrejsonData = jsonData.usuarios.nombre
  const nombres_usuarios = jsonData.usuarios.map(usuario => usuario.nombre);
  // Validaciones son exitosas, enviar una respuesta
  res.json(nombres_usuarios);
});


//Funcion lee archivo Json
const readData = () => {
  try{
      const data = fs.readFileSync("./db.json")
      return JSON.parse(data);
      //console.log(JSON.parse(data));
  }catch(error){
      console.log(error);
  }
}
const ordenarUsuarios = (sort,count) => {

  const data = readData();

  // Obtener los primeros "cont" elementos del JSON
  const elementos = data.usuarios.slice(0, count);

  // Ordenar los usuarios según el parámetro sort
  const usuariosOrdenados = [...elementos];

  if (sort === 'ASC') {
      usuariosOrdenados.sort((a, b) => a.id - b.id);
  } else {
      usuariosOrdenados.sort((a, b) => b.id - a.id);
  }

  // Crear y retornar el objeto JSON con los usuarios ordenados
  return { usuarios: usuariosOrdenados };
}




app.get("/coin/:coinName", (req, res) => {
  const { coinName } = req.params;
  fetch(`https://api.coincap.io/v2/assets/${coinName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("La solicitud no fue exitosa");
      }
      return response.json();
    })
    .then((data) => {
      if (data.data) {
        const coinData = data.data;
        const mensaje = `El precio de la moneda ${coinData.name} es ${coinData.priceUsd}`;
        res.json({ mensaje });
      } else {
        throw new Error("La moneda solicitada no fue encontrada en la API");
      }
    })
    .catch((error) => {
      console.error("Hubo un error al obtener los datos:", error);
      res.status(400).json({ error: error.message });
    });
});

app.listen(port, () =>
  console.log(`Servidor esta en el puerto http://localhost:${port}`)
);
