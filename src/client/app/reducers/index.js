import { combineReducers } from 'redux';
import monReducer from './monReducer';
import banReducer from './banReducer';
// import {dashboard, dashboard2, dashboard3} from './dashboardReducer';

 const rootReducer = combineReducers({
   Mon: monReducer,
   Ban: banReducer,
//    dashboard,
//    dashboard2,
//    dashboard3
 });

 export default rootReducer;
