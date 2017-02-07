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
export function shootEnemy(ranged, num, hp, defense) {
  return {
    type: 'shootEnemy',
    ranged: ranged,
    num: num,
    hitpoints: hp,
    defense: defense
  }
}