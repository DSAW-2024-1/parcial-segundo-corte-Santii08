const express = require("express");
const app = express();
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

app.get('/users/:count', (req, res) => {
    
    //valor de la variable count de la URL
    const count = req.params.count;

    // valido si count es numérico
    if (isNaN(count)) {
        return res.status(400).json({ error: 'La variable count debe ser numérica.' });
    }

    // Valido sort existe y es válida
    const sort = req.query.sort;
    if (!sort || (sort !== 'ASC' && sort !== 'DESC')) {
        return res.status(400).json({ error: 'La variable sort debe ser ASC o DESC.' });
    }

    // Validaciones son exitosas, enviar una respuesta
    res.json({ count,sort});
}); 
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
