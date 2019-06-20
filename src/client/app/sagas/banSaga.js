import { call, put, select , take, takeLatest, fork} from 'redux-saga/effects';
import * as actions from './../actions/actions';
import fireBaseAPI from './../api/firebaseAPI';
import 'regenerator-runtime/runtime';
export function* loadBan(action) {
  try {
    console.log(action)
    if(action.payload){
      let ban = action.payload;
    yield put({ type: actions.FETCH_BAN_SUCCESS_X, ban})};
    //Tell the store we are ready to be displayed
    // yield put({type: 'FETCH_DASHBOARD2_SUCCESS', payload: {}});

  } catch(error) {
    console.log(error.message);
    yield put({type: 'FETCH_FAILED', error: error.message});
  }
}
export function* banSaga() {
  // yield fork(loadBan);
  yield takeLatest(actions.FETCH_BAN_SUCCESS, loadBan);
}
