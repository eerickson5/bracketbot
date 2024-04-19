    import React, { useState } from 'react';
    import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
    import TeamCard from './TeamCard';
    import { Button, Container } from 'semantic-ui-react';

    export default function DragAndDropPools({tournament}) {
        const [data, setData] = useState(formatData());

        function formatData(){
            let newData = {
                teams: teamsToDict(tournament.teams),
                pools: poolsToDict(2),
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

    //TODO - they run off the screen crying emoji
    return (
        <Container>
            <div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
                <h1 style={{margin: 20}}>Assign Teams to Pools</h1>
                <Button content='Add a Pool' icon='plus' labelPosition='right' secondary onClick={handleAddPool}/>
                <Button content='Remove a Pool' icon='minus' labelPosition='right' onClick={handleRemovePool}/>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex' }}>
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
                            style={{
                                border: '2px solid lightgrey',
                                borderRadius: '10px',
                                padding: 4,
                                minWidth: 200,
                                minHeight: 200
                            }}
                            >
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
                            </div>
                        )}
                        </Droppable>
                    </div>
                    );
                })}
                </div>
            </DragDropContext>
        
        </Container>
    );
    }

