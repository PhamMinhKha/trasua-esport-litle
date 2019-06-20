import * as actions from './../actions/actions';
const banReducer = (state = [], action)  => {
    switch(action.type) {
      case 'FETCH_BAN_SUCCESS_X' :
          let newState = { ...state, ban: action.ban  }
          // state = action.danh_sach_ban.val();
          return newState;
      default :
        return state;
    }
  };
  
  export default banReducer;
  