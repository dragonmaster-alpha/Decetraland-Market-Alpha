import { createStore } from 'redux'

const initialState = {
  sidebarShow: 'responsive',
  cardList: [],
  allCardList: [],
  cardDetail: {},
  mana: 0,
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'SET_CARD_LIST':
      return { ...state, cardList: rest.cardList }
    case 'SET_ALL_CARD_LIST':
      return { ...state, allCardList: rest.allCardList }
    case 'SET_CARD_DETAIL':
      return { ...state, cardDetail: rest.cardDetail }
    case 'SET_MANA':
      return { ...state, mana: rest.mana }
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store