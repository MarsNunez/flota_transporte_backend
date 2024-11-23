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
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permite todas las solicitudes
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    console.log("Options");

    // Responder al preflight de CORS
    res.statusCode = 204; // Sin contenido
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.end();
  } else if (req.method === "GET") {
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
    switch (req.url) {
      case "/conductores/update":
        if (req.method === "PUT") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                dni,
                nombre,
                codigo_antecedente_policial,
                codigo_antecedente_penal,
                nro_licencia_conducir,
              } = JSON.parse(body);

              await client.query(
                "CALL actualizar_conductor_completo($1, $2, $3, $4, $5);",
                [
                  dni,
                  nombre,
                  codigo_antecedente_policial,
                  codigo_antecedente_penal,
                  nro_licencia_conducir,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "Conductor actualizado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al actualizar el conductor en la base de datos",
                })
              );
            }
          });
        }
        break;
      case "/vehiculos/update":
        if (req.method === "PUT") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                placa,
                marca,
                modelo,
                dni_conductor,
                certificado_habilitacion_vehicular_especial,
                soat,
                tarjeta_unica_circulacion,
                tarjeta_identificacion_vehicular_electronica,
              } = JSON.parse(body);

              await client.query(
                "CALL actualizar_vehiculo_completo($1, $2, $3, $4, $5, $6, $7, $8);",
                [
                  placa,
                  marca,
                  modelo,
                  dni_conductor,
                  certificado_habilitacion_vehicular_especial,
                  soat,
                  tarjeta_unica_circulacion,
                  tarjeta_identificacion_vehicular_electronica,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "Vehículo actualizado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al actualizar el vehículo en la base de datos",
                })
              );
            }
          });
        }
        break;
      case "/volquetes/update":
        if (req.method === "PUT") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                codigo,
                placa_vehiculo,
                longitud,
                ancho,
                altura,
                carga_util,
                peso_bruto,
              } = JSON.parse(body);

              await client.query(
                "CALL actualizar_volquete_completo($1, $2, $3, $4, $5, $6, $7);",
                [
                  codigo,
                  placa_vehiculo,
                  longitud,
                  ancho,
                  altura,
                  carga_util,
                  peso_bruto,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "Volquete actualizado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al actualizar el volquete en la base de datos",
                })
              );
            }
          });
        }
        break;
      case "/cargamentos/update":
        if (req.method === "PUT") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                nro,
                origen,
                unidad,
                peso,
                nombre,
                destino,
                codigo_volquete,
              } = JSON.parse(body);

              await client.query(
                "CALL actualizar_cargamento_completo($1, $2, $3, $4, $5, $6, $7);",
                [nro, origen, unidad, peso, nombre, destino, codigo_volquete]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "Cargamento actualizado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error:
                    "Error al actualizar el cargamento en la base de datos",
                })
              );
            }
          });
        }
        break;
      case "/clientes/update":
        if (req.method === "PUT") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { ruc, nombre, ubicacion, telefono, nro_cargamento } =
                JSON.parse(body);

              await client.query(
                "CALL actualizar_cliente_completo($1, $2, $3, $4, $5);",
                [ruc, nombre, ubicacion, telefono, nro_cargamento]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "Cliente actualizado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al actualizar el cliente en la base de datos",
                })
              );
            }
          });
        }
        break;
      case "/registros/update":
        if (req.method === "PUT") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                nro_registro,
                nro_cargamento,
                fecha_partida,
                dni_conductor,
                placa_vehiculo,
                ubicacion_destino,
                fecha_estimada_llegada,
                ubicacion_origen,
              } = JSON.parse(body);

              await client.query(
                "CALL actualizar_registro_transporte_completo($1, $2, $3, $4, $5, $6, $7, $8);",
                [
                  nro_registro,
                  nro_cargamento,
                  fecha_partida,
                  dni_conductor,
                  placa_vehiculo,
                  ubicacion_destino,
                  fecha_estimada_llegada,
                  ubicacion_origen,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  message: "Registro de transporte actualizado con éxito",
                })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error:
                    "Error al actualizar el registro de transporte en la base de datos",
                })
              );
            }
          });
        }
        break;
      default:
        break;
    }
  } else if (req.method == "POST") {
    switch (req.url) {
      case "/conductores/delete":
        if (req.method == "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { dni } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query("SELECT eliminar_conductor($1);", [dni]);

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              console.log("DNI " + dni);

              res.end(JSON.stringify({ message: "DNI " + dni }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al eliminar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/vehiculos/delete":
        // if (req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
          body += chunk.toString();
        });

        req.on("end", async () => {
          try {
            const { placa } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

            // Llamada a la función eliminar_conductor
            await client.query("SELECT eliminar_vehiculo($1);", [placa]);

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({ message: "Vehiculo eliminado con éxito" })
            );
          } catch (error) {
            console.error(error);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error: "Error al eliminar en la base de datos",
              })
            );
          }
        });
        // }
        break;
      case "/volquetes/delete":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { codigo } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query("SELECT eliminar_cabecera_volquete($1);", [
                codigo,
              ]);

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "volquete eliminado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al eliminar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/cargamentos/delete":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { nro } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query("SELECT eliminar_cargamento($1);", [nro]);

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "cargamento eliminado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al eliminar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/clientes/delete":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { ruc } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query("SELECT eliminar_cliente($1);", [ruc]);

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "cliente eliminado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al eliminar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/registros/delete":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { nro_registro } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query("SELECT eliminar_registro_transporte($1);", [
                nro_registro,
              ]);

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "registro eliminado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al eliminar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/conductores/insert":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                dni,
                nombre,
                codigo_antecedente_policial,
                codigo_antecedente_penal,
                nro_licencia_conducir,
              } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query(
                "CALL insertar_conductor_completo($1, $2, $3, $4, $5);",
                [
                  dni,
                  nombre,
                  codigo_antecedente_policial,
                  codigo_antecedente_penal,
                  nro_licencia_conducir,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "usuario creado con éxito" }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al insertar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/vehiculos/insert":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                placa,
                marca,
                modelo,
                dni,
                certificado_habilitacion_vehicular_especial,
                soat,
                tarjeta_unica_circulacion,
                tarjeta_identificacion_vehicular_electronica,
              } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query(
                "CALL insertar_vehiculo_completo($1, $2, $3, $4, $5, $6, $7, $8);",
                [
                  placa,
                  marca,
                  modelo,
                  dni,
                  certificado_habilitacion_vehicular_especial,
                  soat,
                  tarjeta_unica_circulacion,
                  tarjeta_identificacion_vehicular_electronica,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "vehiculo creado con éxito" }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error,
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/volquetes/insert":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                codigo,
                placa_vehiculo,
                longitud,
                ancho,
                altura,
                carga_util,
                peso_bruto,
              } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query(
                "CALL insertar_volquete_completo($1, $2, $3, $4, $5, $6, $7);",
                [
                  codigo,
                  placa_vehiculo,
                  longitud,
                  ancho,
                  altura,
                  carga_util,
                  peso_bruto,
                ]
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "vehiculo creado con éxito" }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al insertar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/cargamentos/insert":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                nro,
                origen,
                unidad,
                peso,
                nombre,
                destino,
                codigo_volquete,
              } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query(
                "CALL insertar_cargamento_completo($1, $2, $3, $4, $5, $6, $7);",
                [nro, origen, unidad, peso, nombre, destino, codigo_volquete]
              );
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "cargamento creado con éxito" })
              );
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al insertar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/clientes/insert":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const { ruc, nombre, ubicacion, telefono, nro_cargamento } =
                JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query("CALL insertar_cliente($1, $2, $3, $4, $5);", [
                ruc,
                nombre,
                ubicacion,
                telefono,
                nro_cargamento,
              ]);
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "cliente creado con éxito" }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al insertar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
        }
        break;
      case "/registros/insert":
        if (req.method === "POST") {
          let body = "";

          req.on("data", (chunk) => {
            body += chunk.toString();
          });

          req.on("end", async () => {
            try {
              const {
                nro_registro,
                nro_cargamento,
                fecha_partida,
                dni_conductor,
                placa_vehiculo,
                ubicacion_destino,
                fecha_estimada_llegada,
                ubicacion_origen,
              } = JSON.parse(body); // Extrae el DNI del cuerpo de la solicitud

              // Llamada a la función eliminar_conductor
              await client.query(
                "CALL insertar_registro_transporte($1, $2, $3, $4, $5, $6, $7, $8);",
                [
                  nro_registro,
                  nro_cargamento,
                  fecha_partida,
                  dni_conductor,
                  placa_vehiculo,
                  ubicacion_destino,
                  fecha_estimada_llegada,
                  ubicacion_origen,
                ]
              );
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "registro creado con éxito" }));
            } catch (error) {
              console.error(error);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "Error al insertar en la base de datos",
                })
              );
            }
          });
        } else {
          res.statusCode = 405; // Método no permitido
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: "Método no permitido" }));
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
