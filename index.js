const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const path = require('path');
const app = express()
const router = express.Router();
const clc = require('cli-color');
require('log-timestamp');

var domain = "https://in.bookmyshow.com";
const port = 3000;

var ApplicationName = "BookMyShowApi🎫";
var Author = "Healer-op";

app.use(express.static(path.join(__dirname, 'view')));

//////////////////////////////////////// C L I C O L O R S //////////////////////////////////////////////
var errorc = clc.red.bold;
var successc = clc.green.bold;
var yellowb = clc.yellowBright.bold;
var blueb = clc.blueBright.bold;




///////////////////////////////////// W H I T E L I S T I N G //////////////////////////////////////////

var whitelist = ["*","http://localhost:3000"]
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

///////////////////////////////////// E X P R E S S R O U T E R S //////////////////////////////////////

// Index Page
app.use('/', router);

// Json Data Based On Cities
app.get('/movies/:city',cors(corsOptionsDelegate),(req,res)=>{
  
  var data={};
  var city = req.params.city;
  data.name=`${ApplicationName}`;
  data.author = `${Author}`;
  data.requestingTo = `${domain}/explore/home/${city}`
  data.requestingFrom = `http://localhost:3000/movies/${city}`
  data.titles = [];
  data.imgs = [];

  axios.get(`${domain}/explore/home/${city}`).then(urlResponse =>{
    const $ = cheerio.load(urlResponse.data);
    $('a').each((i,element) =>{
        

      const img = $(element).find('img').attr('src')
      if(img){
        const title = $(element).find('div').text();
        if(title){
          data.titles.push(title);
          data.imgs.push(img);
        }
        
      }
      
        
    });
  })
  .then(() => {
      res.send(data);
      var status = "✅"
      var message = "Successfully";
      if(!data.titles[0]){
        status="❌";
        message = "with Error or No Data";
        console.log(`[ ${status} ]`+yellowb(`${ApplicationName}`)+clc.white(` : Movie Data For `)+clc.white.bold(`"${city}"`)+clc.white(` is Requested and returned `)+errorc(`"${message}"`));
        console.log(``);
      }
      else{
        console.log(`[ ${status} ]`+yellowb(`${ApplicationName}`)+clc.white(` : Movie Data For `)+clc.white.bold(`"${city}"`)+clc.white(` is Requested and returned `)+successc(`"${message}"`));
        console.log(``);
      }
  })
})

app.listen(port, () => {
  console.log(``);
  console.log(errorc(`[+]`+clc.green(`----------------------------------------------------`)+errorc(`[+]`)));
  console.log(clc.green(` |                                                      |`));
  console.log(clc.green(` | `+yellowb(`${ApplicationName}`)+clc.white(` listening at `)+blueb(`http://localhost:${port}`)+clc.green(`   |  `)));
  console.log(clc.green(` |                  `+yellowb(`MADE BY ${Author}`)+clc.green(`                   |  `)));
  console.log(clc.green(` |                                                      |  `));
  console.log(errorc(`[+]`+clc.green(`----------------------------------------------------`)+errorc(`[+]`)))
  console.log(``);
  console.log(`[ 🟢 ]`+yellowb(`${ApplicationName}`)+clc.white(` :`)+successc(` Is Running Fine`));
  console.log(``);
})
