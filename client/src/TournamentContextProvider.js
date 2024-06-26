import React from "react"

const TournamentContext = React.createContext()

export function TournamentProvider({children}){
    const [tournament, setTournament] = React.useState({teams:{}, name: "", image: "", stages:[]})

    return <TournamentContext.Provider value={[tournament, setTournament]}>
        {children}
    </TournamentContext.Provider>
}

export default TournamentContext;

//change stages into an object to access via ID ?
//change games into an object to access via ID ?
