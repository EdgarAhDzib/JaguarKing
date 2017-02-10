import { combineReducers } from "redux"

import spells from "./spellsReducer"
import moves from "./movesReducer"
import teams from './teamsReducer'

export default combineReducers({
	spells,
	moves,
	teams
})