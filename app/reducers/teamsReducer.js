export default function reducer(state={
		team: ""
	}, action) {
		switch (action.type) {
			case 'teamName' :
				return {... state, team: action.payload}
				break;
			default:
				return state;
		}
}