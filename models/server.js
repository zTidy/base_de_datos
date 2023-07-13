let express = require("express");
let sha1 = require("sha1");
let session = require("express-session");
let cookie = require("cookie-parser");


class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.app.use(express.static('public'));
        //View engine
        this.app.set('view engine', 'ejs');
        this.app.use(cookie());

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
    }

    routes(){
        this.app.get('/hola',(req, res)=> {
            if(req.session.user){
               if(req.session.user.rol=='admin'){
                res.send("Has iniciado como administrador!")
               }
               else{
                res.send("Has iniciado como cliente!")
               }
            }
            else{
                res.send("NO HAS INICIADO SESIÓN")
            }
            
        });

        this.app.get('/login',(req, res)=> {
            let usuario = req.query.nombre_usuario;
            let contrasena = req.query.contrasena;
            ////////Cifrado
            //////////////////////////////////////////////
            let passSha1 = sha1(contrasena);
            /////////////////////////////////////////////
            let mysql = require('mysql');

            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "Huevos.kaka1",
              database: "escuela"
            });

            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              let sql = "select * from usuario where nombre_usuario = '" + usuario +"'";
              con.query(sql, function (err, result) {
                if (err) throw err;
                if (result.length>0)
                    if(result[0].contrasena==passSha1){
                      let user = {
                          nam: usuario,
                          psw: contrasena,
                          rol: result[0].rol
                      };
                      req.session.user = user
                      req.session.save();

                      res.render("inicio", {nombre: result[0].nombre_usuario,
                        rol: result[0].rol});
                    }
                    else
                      res.render("login", {error: "Contraseña Incorrecta!!"});
                    
                else
                  res.render("login", {error: "Usuario no existe!!!"});
              });
            });
      });

        //RUTA DAR DE BAJA ALUMNOS////


        //RUTA DE REGISTRAR ALUMNO//
        this.app.get("/registrar", (req, res) => {
            let mat=req.query.matrícula;
            let nombre=req.query.nombre;
            let Cuatrimestre=req.query.Cuatrimestre;
            let mysql = require('mysql');

            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "Huevos.kaka1",
              database: "escuela"
            });

            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              let sql = "INSERT INTO Alumno VALUES ("+mat+ ",'"+nombre+"','"+Cuatrimestre+"')";
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.render("registrado", {mat:mat,nombre: nombre,cuatri:Cuatrimestre});
                console.log("1 record inserted");
              });
            });
                    });
                    this.app.get("/regcursos", (req, res) => {
                        let id_curso=req.query.id_curso;
                        let nombre=req.query.nombre;
                        let mysql = require('mysql');

            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "Huevos.kaka1",
              database: "escuela"
            });

            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              let sql = "INSERT INTO curso VALUES ("+id_curso+ ",'"+nombre+"')";
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.render("regcursos", {id_curso:id_curso,nombre:nombre});
                console.log("1 record inserted");
              });
            });
                    });
                    this.app.get("/inscribir", (req, res) => {
                      let mat=req.query.mat;
                      let id_curso=req.query.id_curso;
                      let mysql = require('mysql');

            let con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Huevos.kaka1",
            database: "escuela"
            });

            con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            let sql = "INSERT INTO inscrito VALUES ("+mat+ ",'"+id_curso+"')";
            con.query(sql, function (err, result) {
              if (err) throw err;
              res.render("inscribir", {mat:mat,id_curso:id_curso});
              console.log("1 record inserted");
            });
            });
                  });
                }

                listen(){
                    this.app.listen(this.port, () => {
                        console.log("http://127.0.0.1:" + this.port);
                    });
                }

            }

            module.exports = Server;