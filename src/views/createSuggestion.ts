import moment from "moment"

export async function createSuggestion() {
    const inpt = [
        {from: "2023-12-01T10:50:00.000+00:00", to: "2023-12-01T12:50:00.000+00:00"},
        {from: "2023-12-01T15:50:00.000+00:00", to: "2023-12-01T17:50:00.000+00:00"},
        {from: "2023-12-01T17:50:00.000+00:00", to: "2023-12-01T19:50:00.000+00:00"},
    ]
    for(let i =0; i < inpt.length; i++){
        const currentInterval = inpt[i]
        let nextInterval = inpt[i + 1]
        if(!nextInterval){
            nextInterval = {from: "2023-12-01T23:00:00.000+00:00", to: "2023-12-01T23:00:00.000+00:00"}
        }
        
        const currentTo = moment(currentInterval.to)
        const nextFrom = moment(nextInterval.from)

        const diff = moment.duration(nextFrom.diff(currentTo))
        if(diff.asHours() > 1){
            console.log(`this diff is good: `, i)
        }
    }
}