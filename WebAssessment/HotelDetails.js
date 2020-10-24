const app = require('express')();
const parser = require("body-parser");
const fs = require("fs");
const dir = __dirname;
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
let hotels = [];
function readData(){
    const filename = "data.json";//new file... 
    const jsonContent = fs.readFileSync(filename, 'utf-8');
    hotels = JSON.parse(jsonContent);
}
function saveData(){
    const filename = "data.json";
    const jsonData = JSON.stringify(hotels);
    fs.writeFileSync(filename, jsonData, 'utf-8');
}
app.get("/hotels", (req, res)=>{
    readData();
    res.send(JSON.stringify(hotels));    
})
app.get("/hotels/:id", (req, res)=>{
    const hotelid = req.params.id;
    if(hotels.length == 0){
        readData();
    }
    let Record = hotels.find((d) => d.hotelId == hotelid);
    if(Record == null)
        throw "Hotel not found";
    res.send(JSON.stringify(Record))
})
app.put("/hotels", (req, res)=>{
    if(hotels.length == 0)
        readData();
    let body = req.body;
    for (let index = 0; index < hotels.length; index++) {
        let element =hotels[index];
        if (element.hotelId == body.hotelId) {
            element.hotelName = body.hotelName;
            element.hotelAddress = body.hotelAddress;
            element.hotelSalary = body.hotelSalary;
            saveData();
            res.send("Hotel updated successfully");
        }
    }
    
})
app.post('/hotels', (req, res)=>{
    if (hotels.length == 0)
        readData();
    let body = req.body;
    hotels.push(body);  
    saveData();
    res.send("Hotels added successfully");
})
app.delete("/hotels/:id", (req, res)=>{
    const hotelid = req.params.id;
    if(hotels.length == 0){
        readData();
    }
    let Record = hotels.find((d) => d.hotelId == hotelid);
    let index = hotels.indexOf(Record)
    hotels.splice(index,1);
    res.send("Hotels deleted Successfully");
})

app.listen(8080, ()=>{
    console.log("Server available at 8080");
})
