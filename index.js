const http = require('http');

const fs = require('fs');

var requests = require('requests');

const homeFile = fs.readFileSync("home.html","utf-8");

const replaceval =(tempval,orgval)=>{

    var tmp = orgval.main.temp-273.15;
    let temperature = tempval.replace("{%tempval%}",Math.round(tmp));

     var min_val = orgval.main.temp_min-273.15;
     temperature =temperature. replace("{%tempmin%}",Math.round(min_val));


     let max_val = orgval.main.temp_max-273.15; 
     temperature =temperature. replace("{%tempmax%}",Math.round(max_val));
     temperature =temperature. replace("{%location%}",orgval.name);
     temperature =temperature. replace("{%country%}",orgval.sys.country);

    
     return temperature;

}
//npm init
const server = http.createServer((req,res)=>{
   if(req.url=="/"){
    requests('https://api.openweathermap.org/data/2.5/weather?lat=22.5726459&lon=88.3638953&appid=bc20beb2ffd7986eb6dd01c14e5c41be')

    //, { streaming }

    .on('data',  (chunk)=> {
      const objdata = JSON.parse(chunk);
      const arrData = [objdata];
      // console.log(arrData);

      const realTimeData = arrData.map((val)=>
        // console.log(val.main);
        replaceval(homeFile,val)).join("");
        res.write(realTimeData);
    // console.log(realTimeData);
    })
    .on('end',  (err)=> {
      if (err) return console.log('connection closed due to errors', err);
      res.end();
    });

   }
})


server.listen(8000,"127.0.0.1");