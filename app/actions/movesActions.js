//Spell actions
export function tahui(ranged) {
  return {
    type: 'tahui',
    payload: ranged
  }
}

export function fireball(id, hp, resist) {
  return {
    type: 'fireball',
    id: id,
    hitpoints: hp,
    resist: resist
  }
}

export function kieri(unit) {
  return {
    type: 'kieri'
  }
}

//Move actions
export function shootEnemy(prevAllyId, attackerHp, ranged, num, ammo, id, hp, defense) {
  return {
    type: 'shootEnemy',
    prevAllyId: prevAllyId,
    prevHp: attackerHp,
    attack: ranged,
    num: num,
    ammo: ammo,
    targetId: id,
    hitpoints: hp,
    defense: defense
  }
}

export function boltEnemy(prevId, attackerHp, ranged, num, magic, id, hp, resist) {
  return {
    type: 'boltEnemy',
    prevId: prevId,
    prevHp: attackerHp,
    attack: ranged,
    num: num,
    magic: magic,
    targetId: id,
    hitpoints: hp,
    resist: resist
  }
}

export function attackEnemy(prevId, attackerHp, melee, num, attackerDefense, id, hp, defense, unitMelee, unitNum) {
  return {
    type: 'attackEnemy',
    prevId: prevId,
    prevHp: attackerHp,
    attack: melee,
    num: num,
    attackerDefense: attackerDefense,
    targetId: id,
    hitpoints: hp,
    defense: defense,
    unitMelee: unitMelee,
    unitNum: unitNum
  }
}