import { combineReducers } from 'redux'
import restaurantReducer from './restaurantReducer'
import customerReducer from './customerReducer'

export default combineReducers({
    restaurant: restaurantReducer,
    customer: customerReducer
})
