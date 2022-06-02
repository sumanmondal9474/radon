const d = function() {
    const mesg=" functionup  "
    const mesg2="function up"
    const mesg3="FUNCTION UP"
    const trimFunc=mesg.trim();   
    const upperFunc=mesg2.toUpperCase()
    const lowerFunc=mesg3.toLowerCase()
    console.log(trimFunc)
    console.log(upperFunc)
    console.log(lowerFunc)

}
module.exports.d = d