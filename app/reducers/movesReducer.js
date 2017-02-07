export default function reducer(state={
		prevId: "",
		unitId: "",
		prevHp: 0,
		totalHP: 0,
		defense: 0,
		resist: 0,
		ranged: 0,
		ammo: 0,
		magic: 0,
		melee: 0,
		initSpeed: 0,
		speed: 0,
		attackerDefense: 0,
		unitMelee: 0,
		unitNum: 0,
		attackersNum: 0,
		castersNum: 0,
		unitIsAffected: false,
		tahuiSpell: false,
	}, action) {

		var num = action.num;
		var attack = action.attack;
		var unitNum = action.unitNum;

		var minAttack = attack - 2;
		var fullAttack = 0;

		//e.g., attack of 6 should range from 4 to 6
		//and add a value for each iteration within unit number
		for (let i=0; i<num; i++) {
			var randAttack = Math.ceil(Math.random()* 2) + minAttack;
			//console.log(randAttack);
			fullAttack += randAttack;
		}
		//console.log(fullAttack);

		var defense = action.defense;
		var randDefense = Math.ceil(Math.random()* 2) + defense - 1;
		var inverseDefense = 1 / randDefense;
		//console.log(inverseDefense);

		var attackDamage = Math.ceil(fullAttack * inverseDefense);
		//console.log(attackDamage);

		var attackerDefense = action.attackerDefense * 1.3;
		var randAttackDef = Math.ceil(Math.random()* 2) + attackerDefense - 1;
		var invAttackDef = 1 / randAttackDef;
		//console.log(invAttackDef);

		var unitMelee = action.unitMelee * 0.8;
		var minMelee = unitMelee - 1;

		//Calculate attackers' result HP
		//And pass it into final members number

		var retaliate = 0;
		for (let i=0; i<unitNum; i++) {
			var randAttack = Math.ceil(Math.random()* 2) + minMelee;
			//console.log(randAttack);
			retaliate += randAttack;
		}
		//console.log(retaliate);
		var counterDamage = Math.ceil(retaliate * invAttackDef);
		//console.log(counterDamage);

		var resistance = action.resist;
		var randResist = Math.ceil(Math.random()* 2) + resistance - 1;
		var inverseResist = 1 / randResist;

		var boltDamage = Math.ceil(fullAttack * inverseResist);
		//console.log(boltDamage);

		switch (action.type) {

			//Damage and attack levels are filtered through defense, level, and resistance

			//Spell moves
			case 'tahui':
				return {...state, ranged: action.payload * 2, tahuiSpell: true, unitIsAffected: true}
				break;
			case 'fireball':
				return {...state, unitId: action.id, totalHP: action.hitpoints - Math.ceil(6 * inverseResist), unitIsAffected: true}
				break;
			case 'kieri':
				return {...state, melee: action.melee * 2, defense: Math.ceil(action.defense / 3), unitIsAffected: true}
				break;

			//Attack moves
			case 'shootEnemy' :
			//Include action.ranged and action.num from prevUnit to factor the strength and number of attackers
				return {...state, prevId: action.prevId, prevHp: action.prevHp, unitId: action.targetId, ammo: action.ammo - 1, totalHP: action.hitpoints - attackDamage, unitIsAffected: true}
				break;
			case 'boltEnemy' :
				return {...state, prevId: action.prevId, prevHp: action.prevHp, unitId: action.targetId, magic: action.magic - 1, totalHP: action.hitpoints - boltDamage, unitIsAffected: true}
				break;
			case 'attackEnemy' :
				return {...state, prevId: action.prevId, prevHp: action.prevHp - counterDamage, unitId: action.targetId, totalHP: action.hitpoints - fullAttack, unitIsAffected: true}
				break;
			// case 'previousCoords':
			// 	return {...state, prevXY: action.payload}
			default:
				return state;
		}
}