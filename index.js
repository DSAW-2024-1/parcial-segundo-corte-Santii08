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
const dbData = {
  usuarios: [
    { id: 1, nombre: "ACERO GARCIA, SAMUEL" },
    { id: 2, nombre: "ALJURI MARTINEZ, DAREK" },
    { id: 3, nombre: "CEPEDA URIBE, JUAN FELIPE" },
    { id: 4, nombre: "CHAVES PEREZ, ANA MARIA" },
    { id: 5, nombre: "CRUZ PAVAS, CARLOS DAVID" },
    { id: 6, nombre: "DIAZ ALGARIN, DIEGO NORBERTO" },
    { id: 7, nombre: "DIAZ BERNAL, JORGE ESTEBAN" },
    { id: 8, nombre: "DIAZ VARGAS, DAVID ESTEBAN" },
    { id: 9, nombre: "FORERO PEÑA, JUAN JOSE" },
    { id: 10, nombre: "GUTIERREZ DE PIÑERES BARBOSA, SANTIAGO" },
    { id: 11, nombre: "LOPEZ HUERTAS, SAMUEL ESTEBAN" },
    { id: 12, nombre: "MEDINA FERNANDEZ, MICHAEL STEVEN" },
    { id: 13, nombre: "MORENO CARVAJAL, KATHERIN JULIANA" },
    { id: 14, nombre: "MORENO PATARROYO, JUAN PABLO" },
    { id: 15, nombre: "MUÑOZ SENDOYA, NICOLAS ESTEBAN" },
    { id: 16, nombre: "NAVARRO CUY, SANTIAGO" },
    { id: 17, nombre: "PARRADO MORALES, JUAN PABLO" },
    { id: 18, nombre: "RAMIREZ CHINCHILLA, DANIEL SANTIAGO" },
    { id: 19, nombre: "RESTREPO COCA, JUAN PABLO" },
    { id: 20, nombre: "REYES GONZALEZ, GABRIELA" },
    { id: 21, nombre: "RODRIGUEZ FALLA, JUAN JOSE" },
    { id: 22, nombre: "RUIZ TORRES, VALENTINA" },
    { id: 23, nombre: "SALAS GUTIERREZ, MARIANA" },
    { id: 24, nombre: "SANCHEZ SANDOVAL, SEBASTIAN" },
    { id: 25, nombre: "SARMIENTO GUARNIZO, JOSUE DAVID" },
    { id: 26, nombre: "SOLER PRADO, SANTIAGO" },
    { id: 27, nombre: "TAMAYO LOPEZ, MARIA FERNANDA" },
    { id: 28, nombre: "URREA LARA, DEIVID NICOLAS" },
    { id: 29, nombre: "AZCONA, ANDRÉS" },
  ],
};

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
