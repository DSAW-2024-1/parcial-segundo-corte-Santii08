const express = require("express");
const app = express();
const fs = require("fs");

const port = 8080;

app.use(express.json());

app.post("/users", (req, res) => {
  const { nombre, apellido, correo } = req.body;
  const pais = req.body.pais || "Colombia";
  const ciudad = req.body.ciudad || "Bogotá";

  if (!nombre || !apellido || !correo) {
    res.status(400).send({
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

app.get("/users/:count", (req, res) => {
  const count = parseInt(req.params.count);

  const sort = req.query.sort;
  if (!sort || (sort !== "ASC" && sort !== "DESC")) {
    return res
      .status(400)
      .json({ error: "La variable sort debe ser ASC o DESC." });
  }

  const jsonData = ordenarUsuarios(sort, count);

  const nombres_usuarios = jsonData.usuarios.map((usuario) => usuario.nombre);

  res.json(nombres_usuarios);
});

const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};
const ordenarUsuarios = (sort, count) => {
  const data = readData();

  const elementos = data.usuarios.slice(0, count);

  const usuariosOrdenados = [...elementos];

  if (sort === "ASC") {
    usuariosOrdenados.sort((a, b) => a.id - b.id);
  } else {
    usuariosOrdenados.sort((a, b) => b.id - a.id);
  }

  return { usuarios: usuariosOrdenados };
};

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
