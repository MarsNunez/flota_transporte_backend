const http = require("http");
const { Client } = require("pg");

// Configuración de la conexión a PostgreSQL
const client = new Client({
  host: "localhost", // Cambia según la configuración de tu servidor
  port: 5432, // Puerto de PostgreSQL (por defecto 5432)
  user: "postgres", // Usuario de PostgreSQL
  password: "jutsu123!", // Contraseña del usuario
  database: "flota_transporte", // Nombre de la base de datos
});

client
  .connect()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch((err) => console.error("Error de conexión a PostgreSQL", err));

const server = http.createServer(async (req, res) => {
  if (req.method === "GET") {
    switch (req.url) {
      case "/conductores":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_conductores_documentos();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/vehiculos":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_vehiculos_documentos();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/volquetes":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_volquetes_detalle();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/cargamentos":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_cargamentos();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/clientes":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_clientes();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/registros":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_registros_transporte()"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      default:
        break;
    }
  } else if (req.method === "PUT") {
    // RAUL
    switch (req.url) {
      case "/conductores/update":
        try {
          const result = await client.query("CALL insertar_conductor();");

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al actualizar en la base de datos" })
          );
        }
        break;
      case "/vehiculos/update":
        let body = "";

        // Escuchar el evento 'data' para acumular los datos
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        // Escuchar el evento 'end' para procesar el cuerpo completo
        req.on("end", async () => {
          try {
            // Parsear el cuerpo recibido
            const data = JSON.parse(body);

            // Extraer los valores necesarios del cuerpo
            const {
              placa,
              marca,
              modelo,
              dni_conductor,
              certificado_habilitacion_vehicular_especial,
              soat,
              tarjeta_unica_circulacion,
              tarjeta_identificacion_vehicular_electronica,
            } = data;

            // Llamar al procedimiento almacenado con los valores extraídos
            const result = await client.query(
              "CALL actualizar_vehiculo($1, $2, $3, $4)",
              [placa, marca, modelo, dni_conductor]
            );

            const result2 = await client.query(
              "CALL actualizar_documento_vehiculo($1, $2, $3, $4, $5)",
              [
                placa,
                certificado_habilitacion_vehicular_especial,
                soat,
                tarjeta_unica_circulacion,
                tarjeta_identificacion_vehicular_electronica,
              ]
            );

            // Enviar respuesta de éxito
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: "Vehículo actualizado correctamente",
              })
            );
          } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar el vehículo:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Error al actualizar en la base de datos",
                e: error,
              })
            );
          }
        });
        break;
      case "/volquetes/update":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_volquetes_detalle();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/cargamentos/update":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_cargamentos();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/clientes/update":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_clientes();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/registros/update":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_registros_transporte()"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      default:
        break;
    }
  } else if (req.method === "DELETE") {
    // MIRELLA
    switch (req.url) {
      case "/conductores/delete":
        try {
          const result = await client.query("CALL insertar_conductor();");

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al actualizar en la base de datos" })
          );
        }
        break;
      case "/vehiculos/delete":
        let body = "";

        // Escuchar el evento 'data' para acumular los datos
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        // Escuchar el evento 'end' para procesar el cuerpo completo
        req.on("end", async () => {
          try {
            // Parsear el cuerpo recibido
            const data = JSON.parse(body);

            // Extraer los valores necesarios del cuerpo
            const {
              placa,
              marca,
              modelo,
              dni_conductor,
              certificado_habilitacion_vehicular_especial,
              soat,
              tarjeta_unica_circulacion,
              tarjeta_identificacion_vehicular_electronica,
            } = data;

            // Llamar al procedimiento almacenado con los valores extraídos
            const result = await client.query(
              "CALL actualizar_vehiculo($1, $2, $3, $4)",
              [placa, marca, modelo, dni_conductor]
            );

            const result2 = await client.query(
              "CALL actualizar_documento_vehiculo($1, $2, $3, $4, $5)",
              [
                placa,
                certificado_habilitacion_vehicular_especial,
                soat,
                tarjeta_unica_circulacion,
                tarjeta_identificacion_vehicular_electronica,
              ]
            );

            // Enviar respuesta de éxito
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: "Vehículo actualizado correctamente",
              })
            );
          } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar el vehículo:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Error al actualizar en la base de datos",
                e: error,
              })
            );
          }
        });
        break;
      case "/volquetes/delete":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_volquetes_detalle();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/cargamentos/delete":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_cargamentos();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/clientes/delete":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_clientes();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/registros/delete":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_registros_transporte()"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      default:
        break;
    }
  } else if (req.method === "POST") {
    // ABDIEL
    switch (req.url) {
      case "/conductores/post":
        try {
          const result = await client.query("CALL insertar_conductor();");

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al actualizar en la base de datos" })
          );
        }
        break;
      case "/vehiculos/post":
        let body = "";

        // Escuchar el evento 'data' para acumular los datos
        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        // Escuchar el evento 'end' para procesar el cuerpo completo
        req.on("end", async () => {
          try {
            // Parsear el cuerpo recibido
            const data = JSON.parse(body);

            // Extraer los valores necesarios del cuerpo
            const {
              placa,
              marca,
              modelo,
              dni_conductor,
              certificado_habilitacion_vehicular_especial,
              soat,
              tarjeta_unica_circulacion,
              tarjeta_identificacion_vehicular_electronica,
            } = data;

            // Llamar al procedimiento almacenado con los valores extraídos
            const result = await client.query(
              "CALL actualizar_vehiculo($1, $2, $3, $4)",
              [placa, marca, modelo, dni_conductor]
            );

            const result2 = await client.query(
              "CALL actualizar_documento_vehiculo($1, $2, $3, $4, $5)",
              [
                placa,
                certificado_habilitacion_vehicular_especial,
                soat,
                tarjeta_unica_circulacion,
                tarjeta_identificacion_vehicular_electronica,
              ]
            );

            // Enviar respuesta de éxito
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                message: "Vehículo actualizado correctamente",
              })
            );
          } catch (error) {
            // Manejo de errores
            console.error("Error al actualizar el vehículo:", error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Error al actualizar en la base de datos",
                e: error,
              })
            );
          }
        });
        break;
      case "/volquetes/post":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_volquetes_detalle();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/cargamentos/post":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_cargamentos();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/clientes/post":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_clientes();"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      case "/registros/post":
        try {
          const result = await client.query(
            "SELECT * FROM obtener_registros_transporte()"
          );

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.rows));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({ error: "Error al consultar la base de datos" })
          );
        }
        break;
      default:
        break;
    }
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
