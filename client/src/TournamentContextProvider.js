import React from "react"

const TournamentContext = React.createContext()

export function TournamentProvider({children}){
    const [tournament, setTournament] = React.useState({teams:{}, name: "", image: ""})

    return <TournamentContext.Provider value={[tournament, setTournament]}>
        {children}
    </TournamentContext.Provider>
}

export default TournamentContext;