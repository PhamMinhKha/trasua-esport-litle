import { takeLatest } from 'redux-saga';
import { all } from 'redux-saga/effects';
import {monSaga} from './monSaga';
import {banSaga} from './banSaga';

function* rootSaga() {
  /*The saga is waiting for a action called LOAD_DASHBOARD to be activated */
  yield all([
    monSaga(),
    banSaga()
    // takeLatest('LOAD_DASHBOARD', loadDashboardSequenced),
    // takeLatest('LOAD_DASHBOARD_NON_SEQUENCED', loadDashboardNonSequenced),
    // takeLatest('LOAD_DASHBOARD_NON_SEQUENCED_NON_BLOCKING', loadDashboardNonSequencedNonBlocking),
    // fork(isolatedForecast),
    // fork(isolatedFlight)
  ]);
}

export default rootSaga;
