import { call, put, select , take, takeLatest} from 'redux-saga/effects';
import * as actions from './../actions/actions';
import 'regenerator-runtime/runtime';
export function* themMonVaoGioHang(action) {
  try {
    yield put({ type: actions.THEM_MON_VAO_GIO_HANG_X, mon_moi:action.payload})
    //Tell the store we are ready to be displayed
    // yield put({type: 'FETCH_DASHBOARD2_SUCCESS', payload: {}});

  } catch(error) {
    console.log(error.message);
    yield put({type: 'THEM_VAO_GIO_HANG_THAT_BAI', error: error.message});
  }
}
export function* thayDoiSoLuongMonTrongGioHang(action) {
  try {
    yield put({ type: actions.THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG_X, mon:action.payload})
    //Tell the store we are ready to be displayed
    // yield put({type: 'FETCH_DASHBOARD2_SUCCESS', payload: {}});

  } catch(error) {
    console.log(error.message);
    yield put({type: 'THEM_VAO_GIO_HANG_THAT_BAI', error: error.message});
  }
}
export function* xoaMonKhoiGioHang(action) {
  try {

    yield put({ type: actions.XOA_MON_KHOI_GIO_HANG_X, mon_duoc_chon:action.payload})
    //Tell the store we are ready to be displayed
    // yield put({type: 'FETCH_DASHBOARD2_SUCCESS', payload: {}});

  } catch(error) {
    console.log(error.message);
    yield put({type: 'XOA_MON_KHOI_GIO_HANG_THAT_BAI', error: error.message});
  }
}
export function* xoaTatCa(action) {
  try {

    yield put({ type: actions.XOA_CAC_MON_TRONG_REDUCER_X})
    //Tell the store we are ready to be displayed
    // yield put({type: 'FETCH_DASHBOARD2_SUCCESS', payload: {}});

  } catch(error) {
    console.log(error.message);
    yield put({type: 'XOA_MON_KHOI_GIO_HANG_THAT_BAI', error: error.message});
  }
}

export function* monSaga() {
  yield takeLatest(actions.THEM_MON_VAO_GIO_HANG, themMonVaoGioHang);
  yield takeLatest(actions.XOA_MON_KHOI_GIO_HANG, xoaMonKhoiGioHang);
  yield takeLatest(actions.THAY_DOI_SO_LUONG_MON_TRONG_GIO_HANG, thayDoiSoLuongMonTrongGioHang);
  yield takeLatest(actions.XOA_CAC_MON_TRONG_REDUCER, xoaTatCa);
  // yield takeLatest("DANG_XUAT", dang_xuat);
  // yield takeLatest("CAP_NHAT_THONG_BAO", thong_bao);
  // yield takeLatest("CLICK_XEM_THONG_BAO", click_xem_thong_bao);
  // yield takeLatest("CLICK_DOC_THONG_BAO", click_doc_thong_bao);
  

}
