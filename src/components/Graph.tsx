'use client'

import VisGraph, {GraphData, GraphEvents, Options} from "react-vis-graph-wrapper";

type GraphType = {
    graph: GraphData,
    options?: Options
    events?: GraphEvents
}
export const  Graph = ({graph = { nodes: [], edges: []}, options = {}, events ={}}: GraphType) => {
  return <VisGraph
        graph={graph}
        options={options}
        events={events}
    />
}
