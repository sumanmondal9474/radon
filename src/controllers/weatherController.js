let a = require('axios')

let getlondontemp = async function (req, res) {
    try {
        let lon = req.query.xyz
        let apiKey = req.query.abcd
        let options = {
            method: "get",
            url: `http://api.openweathermap.org/data/2.5/weather?q=${lon}&appid=${apiKey}`
        }

        let result = await a(options);
        console.log(result)
        let data2 = result.data
        let temp1 = data2.main.temp
        res.status(200).send({ msg: temp1, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

let shortOfCities = async function (req, res) {
    try {
        let cities = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
        let citiesArray = []

        for (let i = 0; i < cities.length; i++) {
            let options = {
                method: "get",
                url: `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=e414f866f8aa40284239bab431e620f3`

            }
            let result = await a(options);
            citiesArray.push({ city: cities[i], temp: (result.data.main.temp - 272) })
            // "1+2" = 1+2       `${1+2}`  = 3
        }
        let d = citiesArray.sort((a, b) => { return a.temp - b.temp })
        let f = []
        d.forEach(b => {
            f.push({ city: b.city, temp: `${b.temp} c` })
        })
        res.status(200).send(f)
    }
    catch (err) { res.status(500).send({ msg: err.message }) }
}


module.exports.getlondontemp = getlondontemp
module.exports.shortOfCities = shortOfCities