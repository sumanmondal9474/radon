const x = function printDate() {
    const date=new Date();  
    const day=date.getDate(); 
    console.log("Date is: "+day)
}
const y=function printMonth(){
    const date1=new Date();
    const month = date1.toLocaleString("en-US", { month: "long" });
    console.log("Month is: "+month);
}

const z=function getBatchInfo() {
    console.log("Radon, W3D1, the topic for today is Nodejs module system")
}
module.exports.x = x
module.exports.y = y
module.exports.z = z