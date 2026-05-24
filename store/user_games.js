export const state = () => ({
  items: []
})

export const getters = {
  rankings: (state, getters, rootState, rootGetters) => {
    const games = rootGetters['games/list']

    return games
      .filter(game => game.best_score !== undefined)
      .map(game => ({
        id: game.id,
        name: game.name,
        rank: game.rank, // TODO: implementar calculo de posicion/ranking en el back.
        score: game.best_score,
        time: game.best_time
      }))
  }
}
