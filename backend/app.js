const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { create } = require('ipfs-http-client');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const projectID = process.env.projectID;
const projectSecret = process.env.projectSecret;
const auth = 'Basic ' + Buffer.from(projectID + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
});
const port = 4000;
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

app.post("/multifiles", upload.array("files"), async(req, res) => {
  const files = req.files;

  console.log(files)

  var hash = [];

  for(let i = 0; i < files.length; i++) {
    const ipfs = await client.add({
      path: `${files[i].originalname}`,
      content: fs.createReadStream(`uploads/${files[i].originalname}`)
    });

    fs.unlinkSync(`uploads/${files[i].originalname}`);

    hash.push(`${process.env.infuraDomain}/${ipfs.cid}`);
  }

  res.send({
    result: true,
    hash
  });
});

app.listen(port, () => {
  console.log(`this server running on port ${port}`);
});
