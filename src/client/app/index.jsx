import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, Link, HashRouter  } from "react-router-dom";
import ChonBan from './components/ChonBan.jsx';
import DichVu from './components/DichVu.jsx';
import ThemBan from './components/ThemBan.jsx';
import ThemMon from './components/ThemMon.jsx';
import ChonMon from './components/ChonMon.jsx';
import HoaDon from './components/HoaDon.jsx';
import XemHoaDon from './components/admin/XemHoaDon.jsx';
import ChonBanDeTinhTien from './components/admin/ChonBanDeTinhTien.jsx';
import DangNhap from './components/admin/DangNhap.jsx';
import Menu from './components/dung_chung/Menu.jsx';
import './../public/css/button3d.css';
import './../public/css/myStyles.css';

import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, compose,    } from 'redux';
import config from './config/configClient';
global.config = config;

import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();
import {Provider} from 'react-redux';
import appReducers from './reducers/index';
import rootSagas from './sagas/index';

const store = createStore(
  appReducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSagas);

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    return (
      <Provider store={store}>
      <HashRouter>
      <Menu history={this.props.history}/>
      <div className="container">
      {/* <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/them-ban">Thêm Bàn</Link>
          </li>
          <li>
            <Link to="/them-mon">Thêm Món Mới</Link>
          </li>
          <li>
            <Link to="/chon-mon">Chọn Món</Link>
          </li>
          <li>
            <Link to="/hoa-don">Hóa Đơn</Link>
          </li>
          <li>
            <Link to="/chon-ban-de-tinh-tien">Admin tính tiền</Link>
          </li>
          <li>
            <Link to="/xem-hoa-don">Admin Xem Hóa Đơn</Link>
          </li>
          <li>
            <Link to="/dang-nhap">Đăng nhập</Link>
          </li>
        </ul> */}
        <Route exact path="/" component={ChonBan}/>
        <Route exact path="/chon-ban" component={ChonBan}/>
        <Route exact path="/them-ban" component={ThemBan} />
        <Route exact path="/them-mon" component={ThemMon} />
        <Route exact path="/chon-mon" component={ChonMon} />
        <Route exact path="/hoa-don" component={HoaDon} />
        <Route exact path="/xem-hoa-don" component={XemHoaDon} />
        <Route exact path="/chon-ban-de-tinh-tien" component={ChonBanDeTinhTien} />
        <Route exact path="/dang-nhap" component={DangNhap} />

        <hr/>
      </div>
      <div style={{backgroundColor:"#333300", height:56, width:"100%", position:"fixed", bottom:0, fontSize:26, fontWeight:"bold", color:"white"}}>
          <p style={{textAlign:"center"}}>Trà Sữa Esport</p>
      </div>
    </HashRouter >
    </Provider>
    )
  }
}
 
render(<App/>, document.getElementById('app'));