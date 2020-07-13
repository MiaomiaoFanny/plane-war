import StartPage from './StartPage'
import RestartPage from './RestartPage'
import GamePage from './GamePage'
import BallPage from './BallPage'

export const PAGE = {
  StartPage: 'StartPage',
  RestartPage: 'RestartPage',
  GamePage: 'GamePage',
  BallPage: 'BallPage',
}

const pageMap = {
  [PAGE.StartPage]: StartPage,
  [PAGE.RestartPage]: RestartPage,
  [PAGE.GamePage]: GamePage,
  [PAGE.BallPage]: BallPage,
}


export const getPageComponent = (pageName) => {
  return pageMap[pageName]
}
