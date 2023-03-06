let ServicioDos = require("../models/servicioDos.model");
let Usuario = require("../models/usuario.model");
const crypto = require("crypto");
const fs = require("fs");

const secret = process.env.SECRET_CODIGO_SERVICIOS;

const S3 = require("aws-sdk/clients/s3");

const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const client = new S3Client({
  region: AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

const generarCodigo = function () {
  let letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numeros = "0123456789";
  let cantidadDeNumeros = 10;
  let cantidadDeLetras = 26;

  let etiquetaLetras = "";
  let etiquetaNumeros = "";
  let etiqueta = "";

  for (let index = 0; index < 3; index++) {
    const indice = Math.floor(Math.random() * cantidadDeLetras);
    etiquetaLetras += letras[indice];
  }

  for (let index = 0; index < 3; index++) {
    const indice = Math.floor(Math.random() * cantidadDeNumeros);
    etiquetaNumeros += numeros[indice];
  }

  etiqueta = etiquetaLetras + etiquetaNumeros;

  return etiqueta;
};

async function uploadFile(file) {
  console.log({ funcion: "uploadFile", file });
  // const stream = fs.createReadStream(file.tempFilePath);
  const stream = file.data;

  console.log({ stream });

  const uploadParams = {
    Bucket: AWS_BUCKET_NAME,
    Key: file.name,
    Body: stream,
  };

  console.log({ uploadParams });

  const command = new PutObjectCommand(uploadParams);

  return await client.send(command);
}

exports.obtenerServicios = function (req, res, next) {
  console.log({ msg: "Obtener Servicios" });

  ServicioDos.find().exec((err, servicios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    return res.json({
      ok: true,
      servicios,
    });
  });
};

exports.obtenerGarantias = function (req, res, next) {
  console.log({ msg: "Obtener Garantias" });

  ServicioDos.find({ tipoDeServicio: { $regex: /garant/gi } })
    .populate({
      path: "cliente",
      select: "email",
    })
    .exec((err, servicios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      return res.json({
        ok: true,
        servicios,
      });
    });
};

exports.obtenerUltimosServicios = function (req, res, next) {
  console.log({ msg: "Obtener Servicios" });

  ServicioDos.find()
    .sort("-createdAt")
    .limit(5)
    .exec((err, servicios) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      return res.json({
        ok: true,
        servicios,
      });
    });
};

exports.obtenerServicio = function (req, res, next) {
  console.log({ msg: "Obtener Servicio" });

  ServicioDos.findOne({ codigo: req.params.codigo })
    .populate({
      path: "cliente",
    })
    .exec(async (err, servicio) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      let servicioString = JSON.stringify(servicio);

      servicio = JSON.parse(servicioString);

      if (servicio.foto) {
        const downloadParams = {
          Key: req.params.codigo + ".jpg",
          Bucket: bucketName,
          Expires: 86400,
        };

        const url = s3.getSignedUrl("getObject", downloadParams);

        console.log({ url });

        servicio = { ...servicio, url };
      }

      if (servicio.audio) {
        const downloadParams = {
          Key: req.params.codigo + ".mp3",
          Bucket: bucketName,
          Expires: 86400,
        };

        const urlAudio = s3.getSignedUrl("getObject", downloadParams);

        console.log({ urlAudio });

        servicio = { ...servicio, urlAudio };
      }

      return res.json({
        ok: true,
        servicio,
      });
    });
};

exports.obtenerServicioPorCodigoWeb = function (req, res, next) {
  console.log({ msg: "Obtener Servicio" });

  ServicioDos.findOne({ codigoWeb: req.params.codigoWeb })
    .populate({
      path: "cliente",
      select:
        "primerNombre segundoNombre apellidos razonSocial numeroId telefono",
    })
    .exec((err, servicio) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      return res.json({
        ok: true,
        servicio,
      });
    });
};

exports.obtenerServicioPorNumeroId = function (req, res, next) {
  console.log({ msg: "Obtener Servicio" });

  Usuario.findOne({ numeroId: req.params.numeroId })
    .populate({
      path: "cliente",
      select:
        "primerNombre segundoNombre apellidos razonSocial numeroId telefono",
    })
    .exec((err, usuarioDB) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err,
        });
      }

      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          err: "No hay usuario",
        });
      }

      ServicioDos.find({ cliente: usuarioDB._id }).exec((err, servicios) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err,
          });
        }

        return res.json({
          ok: true,
          servicios,
        });
      });
    });
};

exports.crearServicio = async function (req, res, next) {
  console.log({ msg: "Crear Servicio" });

  try {
    let codigo = generarCodigo();

    let codigoExiste = true;

    while (codigoExiste) {
      let recibo = await ServicioDos.findOne({ codigo });
      console.log({ recibo });
      if (recibo) {
        codigo = generarCodigo();
        codigoExiste = true;
      } else {
        codigoExiste = false;
      }
    }

    let body = req.body;

    body["codigo"] = codigo;

    let totalDeServicios = await ServicioDos.countDocuments();
    body["numeroDeServicio"] = totalDeServicios + 1;
    body["codigoWeb"] = crypto
      .createHmac("sha256", secret)
      .update(body["codigo"])
      .digest("hex");

    console.log({ body });
    let servicio = new ServicioDos(body);

    let servicioDB = await servicio.save();

    res.status(201).json({
      ok: true,
      servicio: servicioDB,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      ok: false,
      error,
    });
  }
};

exports.editarServicio = async function (req, res, next) {
  console.log({ msg: "Crear Servicio" });

  try {
    let body = req.body;
    console.log({ body, _id: req.params.id });

    let servicioDB = await ServicioDos.findOneAndUpdate(
      { _id: req.params.id },
      body
    );

    res.status(201).json({
      ok: true,
      servicio: servicioDB,
    });
  } catch (error) {
    console.log({ error: JSON.stringify(error) });

    return res.status(500).json({
      ok: false,
      error,
    });
  }
};

exports.agregarItemHistorial = async function (req, res, next) {
  console.log({ msg: "Crear Servicio" });

  try {
    let historial = req.body.historial;
    let estado = req.body.estado;
    console.log({ body, _id: req.params.id });

    let servicioDB = await ServicioDos.findOneAndUpdate(
      { _id: req.params.id },
      { historial, estado }
    );

    res.status(201).json({
      ok: true,
      servicio: servicioDB,
    });
  } catch (error) {
    console.log({ error: JSON.stringify(error) });

    return res.status(500).json({
      ok: false,
      error,
    });
  }
};

exports.agregarObservacion = async function (req, res, next) {
  console.log({ msg: "agregarDescripcion" });

  try {
    let observacion = req.body.observacion;
    // let estado = req.body.estado;
    console.log({ observacion, codigo: req.params.codigo });

    let servicioDb = await ServicioDos.findOne({ codigo: req.params.codigo });
    let observacionesAnteriores = servicioDb.observaciones || [];

    let observacionesNuevas = [...observacionesAnteriores, observacion];

    let servicioDB = await ServicioDos.findOneAndUpdate(
      { codigo: req.params.codigo },
      { observaciones: observacionesNuevas }
    );

    res.status(201).json({
      ok: true,
      servicio: servicioDB,
    });
  } catch (error) {
    console.log({ error: JSON.stringify(error) });

    return res.status(500).json({
      ok: false,
      error,
    });
  }
};

exports.subirImagen = async function (req, res, next) {
  console.log({ funcion: "subirImagen" });

  try {
    console.log({ "req.files": req.files, name: req.files["image"].name });
    const result = await uploadFile(req.files["image"]);
    console.log({ result });
    const reciboUpdate = await ServicioDos.findOneAndUpdate(
      { codigo: req.files["image"].name.split(".")[0] },
      { foto: true }
    );
    console.log({ reciboUpdate });
    res.json({ result, reciboUpdate });
  } catch (error) {
    res.status(500).json({ error });
  }
};

exports.subirAudio = async function (req, res, next) {
  console.log({ funcion: "subirAudio" });

  try {
    console.log({ "req.files": req.files, name: req.files["audio"].name });
    const result = await uploadFile(req.files["audio"]);
    console.log({ result });
    const reciboUpdate = await ServicioDos.findOneAndUpdate(
      { codigo: req.files["audio"].name.split(".")[0] },
      { audio: true }
    );
    console.log({ reciboUpdate });
    res.json({ result, reciboUpdate });
  } catch (error) {
    res.status(500).json({ error });
  }
};
