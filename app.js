import mysql from "mysql2"
import express from "express"

const app = express();
const urlencodedParser = express.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "парихмахерская",
    password: "root"
  });

  app.set("view engine", "hbs")

  // получение списка пользователей
app.get("/", function(req, res){
    pool.query('select Дата, филиалы.адрес as "Филиал", клиенты.фамилия as "Фамилия_клиента", сотрудники.фамилия as "Фамилия_сотрудника", `каталог услуг`.наименование, `каталог услуг`.цена from `учет оказания услуг` join сотрудники on `учет оказания услуг`.id_сотрудник = сотрудники.id join клиенты on `учет оказания услуг`.id_клиент = клиенты.id join филиалы on `учет оказания услуг`.id_филиал = филиалы.id join `каталог услуг` on `учет оказания услуг`.id_услуга = `каталог услуг`.id', function(err, data) {
      if(err) return console.log(err);
      res.render("index.hbs", {
          all: data
      });
    });
});

app.get("/services", function(req, res){
    pool.query('select * from `каталог услуг`', function(err, data) {
      if(err) return console.log(err);
      res.render("services.hbs", {
          all: data
      });
    });
});

app.get("/branches", function(req, res){
    pool.query('select филиалы.Адрес, филиалы.Телефон, сотрудники.Фамилия from `филиалы` join сотрудники on `филиалы`.id_администратор = сотрудники.id', function(err, data) {
      if(err) return console.log(err);
      res.render("branches.hbs", {
          all: data
      });
    });
});

app.get("/employers", function(req, res){
    pool.query('select Фамилия, Имя, Телефон, Оклад, Адрес, Название from `сотрудники` join должности on `сотрудники`.id_должность = должности.id', function(err, data) {
      if(err) return console.log(err);
      res.render("employers.hbs", {
          all: data
      });
    });
});

app.get("/jobtitle", function(req, res){
    pool.query('select Название, `График работы` as график from должности', function(err, data) {
      if(err) return console.log(err);
      res.render("jobtittle.hbs", {
          all: data
      });
    });
});

app.get("/customers", function(req, res){
    pool.query('select * from клиенты', function(err, data) {
      if(err) return console.log(err);
      res.render("customers.hbs", {
          all: data
      });
    });
});

// возвращаем форму для добавления данных
app.get("/create", function(req, res){
    res.render("create.hbs");
});

// получаем отправленные данные и добавляем их в БД 
app.post("/create", urlencodedParser, function (req, res) {
         
    if(!req.body) return res.sendStatus(400);
    const query = 'INSERT INTO `учет оказания услуг`(Дата, id_услуга, id_сотрудник, id_клиент, id_филиал) VALUES'
    pool.query(`${query} ('${req.body.date}', ${req.body.service}, ${req.body.employer}, ${req.body.customer}, ${req.body.branch})`, function(err, data) {
      if(err) return console.log(err);
      res.redirect("/");
    });
});
 
// // получем id редактируемого пользователя, получаем его из бд и отправлям с формой редактирования
// app.get("/edit/:id", function(req, res){
//   const id = req.params.id;
//   pool.query("SELECT * FROM users WHERE id=?", [id], function(err, data) {
//     if(err) return console.log(err);
//      res.render("edit.hbs", {
//         user: data[0]
//     });
//   });
// });

// // получаем отредактированные данные и отправляем их в БД
// app.post("/edit", urlencodedParser, function (req, res) {
         
//   if(!req.body) return res.sendStatus(400);
//   const name = req.body.name;
//   const age = req.body.age;
//   const id = req.body.id;
   
//   pool.query("UPDATE users SET name=?, age=? WHERE id=?", [name, age, id], function(err, data) {
//     if(err) return console.log(err);
//     res.redirect("/");
//   });
// });
 
// // получаем id удаляемого пользователя и удаляем его из бд
// app.post("/delete/:id", function(req, res){
          
//   const id = req.params.id;
//   pool.query("DELETE FROM users WHERE id=?", [id], function(err, data) {
//     if(err) return console.log(err);
//     res.redirect("/");
//   });
// });
 
app.listen(3000, function(){
  console.log("Сервер ожидает подключения...");
});