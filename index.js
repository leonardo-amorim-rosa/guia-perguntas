const express = require('express')
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta') // cria a tabela caso não exista
const Resposta = require('./database/Resposta')
require('dotenv/config')

// conectando com a base de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão realizada com a base de dados!")
  })
  .catch((error) => {
    console.log(error)
  })

// configurando o express
const app = express()

app.set('view engine', 'ejs') // configurando o ejs como template engine
app.use(express.static('public')) // configurando a pasta publica

// configurando o body parser para converter dados do formuário
app.use(bodyParser.urlencoded({ extended: false }))
// converter dados json
app.use(bodyParser.json())

// Rotas
app.get('/', (req, res) => {
  // buscando todos os registros na base de dados
  Pergunta.findAll({
    raw: true, order: [
      ['id', 'desc']
    ]
  }).then((perguntas) => {
    //console.log(perguntas)
    res.render('index', { perguntas: perguntas })
  })
})

app.get('/perguntar', (req, res) => {
  res.render('perguntar')
})

app.post('/salvar-pergunta', (req, res) => {
  var titulo = req.body.titulo
  var descricao = req.body.descricao

  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect('/') // redirect to home
  })
    .catch((error) => {
      console.log(error)
    })
  //res.send(`Formulário recebido ${titulo} - ${descricao}`)
})

app.get('/pergunta/:id', (req, res) => {
  var id = req.params.id
  Pergunta.findOne({
    where: { id: id }
  }).then(pergunta => {
    if (pergunta != undefined) { // se encontrar a pergunta

      Resposta.findAll({
        where: { perguntaId: pergunta.id },
        order: [
          ['id', 'desc']
        ]
      })
        .then(respostas => {
          res.render('pergunta', { pergunta: pergunta, respostas: respostas })
        })

    } else {
      res.redirect('/')
    }
  })
})

app.post('/responder', (req, res) => {
  var corpo = req.body.corpo
  var perguntaId = req.body.perguntaId
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  })
    .then(() => {
      res.redirect(`/pergunta/${perguntaId}`)
    })
    .catch(error => {
      console.log(error)
    })
})

const port = process.env.PORT || 3000
app.listen(port, (error) => {
  console.log('Server Up and running on port %s', port)
})