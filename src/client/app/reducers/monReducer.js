import { THEM_MON_VAO_GIO_HANG_X, XOA_MON_KHOI_GIO_HANG_X, THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG_X, XOA_CAC_MON_TRONG_REDUCER_X } from './../actions/actions';
const monReducer = (state = [], action) => {
  switch (action.type) {
    case THEM_MON_VAO_GIO_HANG_X:
      state.push(action.mon_moi);
      return [...state];
    case THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG_X:
        var newState = state;
        const result = newState.map((value, index) => {
          if (value[0] === action.mon[0][0]) {
            // state[index][1].so_luong =  parseInt(state[index][1].so_luong) + 1;
            return newState[index][1].so_luong = newState[index][1].so_luong + action.mon_moi.change;
          }
        });
        if (!result[0] || result.length === 0)
      return [...newState];
    case XOA_MON_KHOI_GIO_HANG_X:
      var newState = state.filter((value, index) => {
        console.log(value[0], action.mon_duoc_chon)
        if(value[0] !== action.mon_duoc_chon)
        return value
      })
      console.log(newState);
      return [...newState];
    case XOA_CAC_MON_TRONG_REDUCER_X:
          return [];
    default:
      return state;
  }
};

export default monReducer;
