/* eslint-disable no-undef */
import React, { Component } from 'react';
import firebase from './../config/FireBase';
import imgBan from './../../public/icons/ban.png';
import ModalXacNhan from './dung_chung/ModalXacNhan.jsx';
import { Toast, Col } from 'react-bootstrap';
//connect redux saga
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { fetch_ban_success, xoa_ban_va_hoa_don_trong_local } from './../actions/actions';
class ChonBan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ban: [],
            thong_bao: '',
            modal: false,
            ma_goi_mon: null,
            modal_xac_nhan: false,
            trang_thai_ban_chon: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.KhungThuThoi = this.KhungThuThoi.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.KiemTraHoaDon = this.KiemTraHoaDon.bind(this);
    }
    componentDidMount() {
        // $('.toast').toast();
        firebase.database().ref('/ban/').on("value", (database) => {
            let newArr = database.val().filter(e => e);
            this.setState({
                ban: newArr
            });
            this.props.fetch_ban_success(this.state.ban);
        })
        var ma_goi_mon = localStorage.getItem('hoa_don');
        var ban = localStorage.getItem('ban');
        if (ma_goi_mon) {
            firebase.database().ref('/goi_mon/' + ma_goi_mon + '/trang_thai').on("value", (database) => {
                if (database.val())// nếu hóa đơn đã thanh toán thì xóa ở local
                {
                    localStorage.removeItem("hoa_don");
                }
            })
        } else if (ban) {// hoa don chua thanh toan
            firebase.database().ref('/ban/' + ban).on("value", (database) => {
                let newArr = database.val()
                if (newArr.goi_mon) {
                    let ma_goi_mon = newArr.goi_mon.id_goi_mon
                    if (ma_goi_mon) {
                        localStorage.setItem("hoa_don", ma_goi_mon);
                    }
                }

            })
        }
    }
    handleCloseModal() {
        this.setState({
            modal_xac_nhan: false
        })
    }
    HandleModal() {
        return <ModalXacNhan history={this.props.history} tua_de="Thông Báo" thong_bao="Bàn này có hóa đơn chưa thanh toán. Bạn có muốn ngồi chung?" path='/hoa-don' param={this.state.ma_goi_mon} color="red" show={this.state.modal_xac_nhan} handleCloseModal={this.handleCloseModal} />
    }
    KiemTraHoaDon(vi_tri, trang_thai) {
        console.log(vi_tri, '=', trang_thai)
        if (trang_thai) {
            let ban = localStorage.getItem('ban');
            let hoa_don = localStorage.getItem('hoa_don');
            console.log(ban, '=', hoa_don)
            if (ban && !hoa_don) {// nếu đã chọn bàn mà muốn đổi bàn khác với điều kiện là không có hoa đơn
                // Kiểm tra xem bạn khách chọn có hóa đơn hay chưa
                //nếu có thì hỏi khách có muốn ngồi chung không
                console.log(1)
                firebase.database().ref('ban/' + ban + '/trang_thai').set(true);
                var data = firebase.database().ref('ban/' + vi_tri);
                data.child('trang_thai').set(false);
                localStorage.setItem('ban', vi_tri);
                return this.props.history.push({
                    pathname: '/chon-mon'
                });
            } else if (ban && hoa_don) {
                return false;
            }
            else {
                console.log(1)
                var data = firebase.database().ref('ban/' + vi_tri);
                data.child('trang_thai').set(false);
                localStorage.setItem('ban', vi_tri);
                return this.props.history.push({
                    pathname: '/chon-mon'
                });
            }
        }
        else {
            // var data = firebase.database().ref('ban/' + vi_tri);
            // data.child('trang_thai').set(false);
            localStorage.setItem('ban', vi_tri);
            return this.props.history.push({
                pathname: '/chon-mon'
            })
        }
    }
    handleClick(vi_tri, trang_thai) {
        // Kiểm tra khách có hóa đơn hay chưa
        let kiem_tra = this.KiemTraHoaDon(vi_tri, trang_thai);
        let hoa_don = localStorage.getItem('hoa_don');
        if (hoa_don) {
            return this.setState({
                modal: true,
                thong_bao: 'Bạn chưa thanh toán hóa đơn đã gọi nên không thể đổi bàn'
            }
            );
        }
        // chua có bàn va chọn bàn có hóa đơn
        firebase.database().ref('/ban/' + vi_tri).on("value", (database) => {
            let goi_mon = database.val().goi_mon;
            console.log(goi_mon)
            if (goi_mon) {
                let ma_goi_mon = goi_mon.id_goi_mon
                if (ma_goi_mon)// nếu đã có hóa đơn
                {
                    this.setState({
                        modal_xac_nhan: true,
                        ma_goi_mon
                    })
                }
            }
        })
    }
    componentWillUpdate() {
        // $('#thong_bao').on('hidden.bs.toast',  () => {
        //     this.setState({
        //         thong_bao: ''
        //     })
        //   })
    }
    KhungThuThoi() {
        return (
            <Toast show={this.state.modal} onClose={() => { this.setState({ modal: false }) }} style={{ position: "absolute", zIndex: 100, display: this.state.modal ? 'block' : 'none' }}>
                <Toast.Header>
                    <strong className="mr-auto">Thông Báo</strong>
                </Toast.Header>
                <Toast.Body>{this.state.thong_bao}</Toast.Body>
            </Toast>
        )
    }
    render() {
        var ban = this.state.ban;
        return (<div className="container ImgCha">
            {this.KhungThuThoi()}
            {this.HandleModal()}
            <div className="row">
                {ban.map((value, i) => {
                    let trang_thai = (value.trang_thai === true) ? 'default' : 'success';
                    return <Col xs={4} sm={4} md={5} key={i}>< button type="button" onClick={() => this.handleClick(value.vi_tri, value.trang_thai)} key={i} name={value.vi_tri} value={value.trang_thai} className={"btn3d btn btn-" + trang_thai + " btn-lg "} >< img src={imgBan} alt="" style={{ width: 50, height: 50, display: "block" }} /> {value.ten_ban} </button ></Col>
                })
                }
            </div>
        </div >
        )
    }
}

const mapStateToProps = (state) => {
    return { items: state.Ban }
}
const mapDispatchToProps = dispatch => ({
    fetch_ban_success: (ban) => dispatch(fetch_ban_success(ban)),
    xoa_ban_va_hoa_don_trong_local: () => dispatch(xoa_ban_va_hoa_don_trong_local()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ChonBan);