const express = require("express");
const validate = require("validate-vat");
const bodyParser = require("body-parser");
const http = require("http");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((request, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (request.method === "OPTIONS") {
        res.header(
            "Access-Control-Allow-Methods",
            "PUT, POST, PATCH, DELETE, GET"
        );
        return res.status(200).json({});
    }
    next();
});

app.post("/vat", (req, res) => {
    const {code, vat} = req.body;
    validate(code, vat,(e, validationInfo)=>{
        res.json(validationInfo);
    })
});

const port = process.env.PORT || 3333;

const server = http.createServer(app);

server.listen(port);
// eslint-disable-next-line no-console
console.log(`App listening localhost:${port}!`);
