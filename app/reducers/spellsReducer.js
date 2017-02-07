export default function reducer(state={
		unitId: "",
		totalHP: 0,
		ranged: 0,
		melee: 0,
		defense: 0,
		increment: 0,
		resist: 0,
		tahuiSpell: false,
		castersNum: 0,
		unitIsAffected: false
	}, action) {

		var resistance = action.resist;

		var randResist = Math.ceil(Math.random()* 2) + resistance - 1;
		var inverse = 1 / randResist;

		switch (action.type) {
			//Damage and attack levels are filtered through defense, level, and resistance
			case 'tahui':
				return {...state, ranged: action.payload * 2, tahuiSpell: true, unitIsAffected: true}
			case 'fireball':
				return {...state, unitId: action.id, totalHP: action.hitpoints - Math.ceil(6 * inverse), unitIsAffected: true}
			case 'kieri':
				return {...state, melee: action.melee * 2, defense: Math.ceil(action.defense / 3), unitIsAffected: true}
			default:
				return state;
		}
}