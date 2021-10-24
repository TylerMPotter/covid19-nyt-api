const PORT = 8000
const express = require('express')
const axios = require('axios')
const codes = require('./stateCodes')

const app = express()

app.get('/total/:date', (req, res) => {

    const wantedDate = req.params.date

    axios.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us.csv')
    .then((response) => {
        const html = response.data
        usData = []

        let us = html.split("\n")

        for(let i = 0; i < us.length; i++) {
            us[i] = us[i].split(",")
        }

        let neededUs = us[0]

        for(let i = 0; i < us.length; i++) {
            if (us[i][0] === wantedDate) {
                neededUs = us[i]
                break;
            }
        }

        usData.push({
            date: neededUs[0],
            cases: neededUs[1],
            deaths: neededUs[2]
        })

        res.json(usData)
    }).catch(err => console.log(err))
})

app.get('/total/:date/:stateAbbrev', (req,res) => {

    const stateAbbrev = req.params.stateAbbrev

    const wantedState = codes.filter(code => code.abbrev == stateAbbrev)[0].state

    const wantedDate = req.params.date

    axios.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
        .then((response) => {
            const html = response.data
            stateData = []

            let states = html.split("\n")

            
            for(let i = 0; i < states.length; i++) {
                states[i] = states[i].split(",")
            }

            let neededState = states[0]

            for(let i = 0; i < states.length; i++) {
                if (states[i][1] === wantedState && states[i][0] === wantedDate) {
                    neededState = states[i]
                    break;
                }
            }


            stateData.push({
                state: neededState[1],
                date: neededState[0],
                cases: neededState[3],
                deaths: neededState[4]
            })

            res.json(stateData)
        }).catch(err => console.log(err))
})

app.get('/specific/:date/:stateAbbrev', (req,res) => {

    const stateAbbrev = req.params.stateAbbrev

    const wantedState = codes.filter(code => code.abbrev == stateAbbrev)[0].state

    const wantedDate = req.params.date

    axios.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us-states.csv')
    .then((response) => {
        const html = response.data
        speData = []

        let spe = html.split("\n")

        for(let i = 0; i < spe.length; i++) {
            spe[i] = spe[i].split(",")
        }

        let neededSpe = spe[0]

        for(let i = 0; i < spe.length; i++) {
            if (spe[i][2] === wantedState && spe[i][0] === wantedDate) {
                neededSpe = spe[i]
                break;
            }
        }


        speData.push({
            state: neededSpe[2],
            date: neededSpe[0],
            cases: neededSpe[3],
            deaths: neededSpe[6]
        })

        res.json(speData)
    }).catch(err => console.log(err))
})

app.get('/specific/:date', (req, res) => {

    const wantedDate = req.params.date

    axios.get('https://raw.githubusercontent.com/nytimes/covid-19-data/master/rolling-averages/us.csv')
    .then((response) => {

        const html = response.data
        speData = []

        let spe = html.split("\n")

        for(let i = 0; i < spe.length; i++) {
            spe[i] = spe[i].split(",")
        }

        let neededSpe = spe[0]

        for(let i = 0; i < spe.length; i++) {
            if (spe[i][0] === wantedDate) {
                neededSpe = spe[i]
                break;
            }
        }

        speData.push({
            date: neededSpe[0],
            cases: neededSpe[2],
            deaths: neededSpe[5]
        })

        res.json(speData)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))