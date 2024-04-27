import React, { useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TeamCard from './TeamCard';
import { Button, Container, Segment } from 'semantic-ui-react';
import TournamentContext from '../TournamentContextProvider';

    export default function DragAndDropPools({onSubmitPools, pools}) {
        const [tournament] = useContext(TournamentContext)
        const [data, setData] = useState(formatData());

        function formatData(){
            let newData = {
                teams: teamsToDict(tournament.teams),
                pools: pools.length ? poolsFromIds(pools) : poolsToDict(1),
            }
            newData['poolOrder'] = Object.keys(newData.pools)
            return newData
        }

    function teamsToDict(teams){
        let teamDict = {}
        teams.forEach(team => {
            teamDict[team.id] = {...team, id: String(team.id)}
        });
        return teamDict
    }

    function poolsFromIds(pools){
        let poolDict = {
            'unassigned': {
                id: 'unassigned',
                title: "Unassigned Teams",
                teamIds: []
            }
        }

        let i = 1
        for(let pool of pools){
            poolDict[`pool-${i}`] = {id: `pool-${i}`, title: `Pool ${i}`, teamIds: pool}
            i ++
        }
        return poolDict
    }

    function createPool(num){
        return {id: `pool-${num}`, title: `Pool ${num}`, teamIds: []}
    }

    function poolsToDict(numPools){
        let poolDict = {
            'unassigned': {
                id: 'unassigned',
                title: "Unassigned Teams",
                teamIds: tournament.teams.map( team => String(team.id))
            }
        }
        for (let i = 1; i <= numPools; i++) {
            poolDict[`pool-${i}`] = createPool(i)
            //use {...createPool(i) to assign random teams}
        }
        return (poolDict)
    }

    const handleAddPool = () => {
        let poolNum = Object.keys(data.pools).length
        setData({
            ...data,
            pools: {...data.pools, [`pool-${poolNum}`]: createPool(poolNum)},
            poolOrder: [...data.poolOrder, `pool-${poolNum}`]
        })
    }

    const handleRemovePool = () => {
        let poolOrder = data.poolOrder
        const idToDelete = poolOrder.pop()
        let newPools = data.pools
        newPools["unassigned"].teamIds = newPools["unassigned"].teamIds.concat(newPools[idToDelete].teamIds)
        delete newPools[idToDelete]
        setData({
            ...data,
            pools: newPools,
            poolOrder
        })
    }

    const handleRandomize = () => {
        let randomizedPools = data.pools

        let availableTeams = randomizedPools["unassigned"].teamIds

        //fisher-yates algorithm to shuffle available teams
        for (let i = availableTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const i_element = availableTeams[i]
            availableTeams[i] = availableTeams[j]
            availableTeams[j] = i_element
        }

        const numOfPools = Object.keys(randomizedPools).length - 1

        let i = 1
        for(let team of availableTeams){
            randomizedPools[`pool-${i}`].teamIds.push(team)
            i < numOfPools ? i ++ : i = 1
        }

        randomizedPools["unassigned"].teamIds = []
        setData({
            ...data,
            pools: randomizedPools
        })
    }

    const handleReset = () => {
        setData({
            ...data,
            pools: poolsToDict(data['poolOrder'].length - 1)
        })
    }


    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // If dropped outside of droppable area or in same place
        if (!destination || (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        )) {
        return;
        }

        const start = data.pools[source.droppableId];
        const finish = data.pools[destination.droppableId];

        // If dropped in the same column
        if (start === finish) {
        const newTeamIds = Array.from(start.teamIds);
        newTeamIds.splice(source.index, 1);
        newTeamIds.splice(destination.index, 0, draggableId);

        const newColumn = {
            ...start,
            teamIds: newTeamIds
        };

        const newData = {
            ...data,
            pools: {
            ...data.pools,
            [newColumn.id]: newColumn
            }
        };

        setData(newData);
        return;
        }

        // Moving from one list to another
        const startTeamIds = Array.from(start.teamIds);
        startTeamIds.splice(source.index, 1);
        const newStart = {
        ...start,
        teamIds: startTeamIds
        };

        const finishTeamIds = Array.from(finish.teamIds);
        finishTeamIds.splice(destination.index, 0, draggableId);
        const newFinish = {
        ...finish,
        teamIds: finishTeamIds
        };

        const newData = {
        ...data,
        pools: {
            ...data.pools,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        }
        };

        setData(newData);
    };

    function handleSubmit(){
        onSubmitPools(Object.keys(data.pools).splice(1).map( key => data.pools[key].teamIds ))
    }

    return (
        <Container style={{maxWidth: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h3>This tournament has no pools yet. Once you've added all your teams, generate your pools here.</h3>
            <div style={{marginBlock: 15, display: "flex", flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', alignSelf: 'center', justifyContent: 'center'}}>
                <Button style={{margin: 5}} content='Reset' icon='repeat' labelPosition='right' secondary onClick={handleReset} 
                disabled={data.pools["unassigned"].teamIds.length !== 0 || data.poolOrder.length <= 1}/>

                <Button style={{margin: 5}} content='Randomize' icon='random' labelPosition='right' secondary onClick={handleRandomize} 
                disabled={data.pools["unassigned"].teamIds.length === 0 || data.poolOrder.length <= 1}/>

                <Button style={{margin: 5}} content='Add Pool' icon='plus' labelPosition='right' secondary onClick={handleAddPool}
                disabled={data.poolOrder.length >= Object.keys(data.teams).length / 2 || data.poolOrder.length >= 8}/>

                <Button style={{margin: 5}} content='Remove Pool' icon='minus' labelPosition='right' secondary onClick={handleRemovePool}
                disabled={data.poolOrder.length === 2}/>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', flexWrap:'wrap' }}>
                {data.poolOrder.map((columnId) => {
                    const column = data.pools[columnId];
                    const teams = column.teamIds.map((teamId) => data.teams[teamId]);

                    return (
                    <div key={column.id} style={{ margin: 8, textAlign: 'center'}}>
                        <h3>{column.title}</h3>
                        <Droppable droppableId={column.id}>
                        {(provided) => (
                            <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            >
                            <Segment style={{
                                minWidth: 200,
                                minHeight: 200
                            }}>
                            {teams.map((team, index) => (
                                <Draggable
                                key={team.id}
                                draggableId={team.id}
                                index={index}
                                >
                                {(provided) => (
                                    <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                        userSelect: 'none',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        ...provided.draggableProps.style
                                    }}
                                    >
                                    <TeamCard team={team}/>
                                    </div>
                                )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                            </Segment>
                            </div>
                        )}
                        </Droppable>
                    </div>
                    );
                })}
                </div>
            </DragDropContext>
        
            <Button
            style={{marginBlock: 10}}
            content='Continue with These Pools'
            secondary
            size='large'
            icon='check circle'
            label={{ basic: true, content: "You won't be able to add more teams beyond this point." }}
            labelPosition='right'
            disabled={data.pools['unassigned'].teamIds.length !== 0}
            onClick={handleSubmit}
            />
        </Container>
    );
    }

