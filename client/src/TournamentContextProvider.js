import React from "react"

const TournamentContext = React.createContext()

export default function TournamentProvider({children}){
    const [tournament, setTournament] = React.useState({})
    return <TournamentContext.Provider value={{tournament, setTournament}}>
        {children}
    </TournamentContext.Provider>
}