import { combineReducers } from "redux"

import spells from "./spellsReducer"
import moves from "./movesReducer"

export default combineReducers({
	spells,
	moves
})