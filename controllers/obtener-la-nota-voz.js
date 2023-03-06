exports.obtenerServicio = function (req, res, next) {
  console.log({ msg: "Obtener Servicio", codigo: req.params.codigo });

  // ServicioDos.findOne({ codigo: req.params.codigo })
  ServicioDos.find()
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

      console.log({ servicio })

      // let servicioString = JSON.stringify(servicio);
      let servicioString = JSON.stringify({});

      servicio = JSON.parse(servicioString);

      // if (servicio.foto) {
        if (true) {
        const downloadParams = {
          // Key: req.params.codigo + ".jpg",
          Key: "AAK046.mp3",
          Bucket: bucketName,
          Expires: 86400,
        };

        const url = s3.getSignedUrl("getObject", downloadParams);

        console.log({ url });

        servicio = { ...servicio, url };
      }

      return res.json({
        ok: true,
        servicio,
      });
    });
};