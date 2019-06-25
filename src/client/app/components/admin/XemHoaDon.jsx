import React, { Component, useRef } from 'react';
import firebase from './../../config/FireBase';
import './../../../public/css/hoa_don.css';
import NumberFormat from 'react-number-format';
import ImgWaiting from './../../../public/images/local/lg.sandglass-time-loading-gif.gif'
import ImgWDone from './../../../public/images/local/yes-tick-success-done-complete-check-allow-512.png'
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import { connect } from 'react-redux';
class XemHoaDon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoa_don: [],
            dang_gui: false,
            diem_nguoc: 3,
            gui_thanh_cong: false,
            error: '',
            ma_hoa_don: '',
            ban: '',
            id_ban: '',
            trang_thai_goi_mon: 0,
            trang_thai_hoa_don: false
        }
        this.TrTable = this.TrTable.bind(this);
        this.FormatGia = this.FormatGia.bind(this);
        this.Ngay_Goi_Mon = this.Ngay_Goi_Mon.bind(this);
        this.ButtonGoiTinhTien = this.ButtonGoiTinhTien.bind(this);
        this.handleClickResetBan = this.handleClickResetBan.bind(this);
    }
    componentDidMount() {
        if (this.props.location.state) {
            var key = this.props.location.state.id_goi_mon;
            var ban = this.props.location.state.ban;
            var ma_ban = this.props.location.state.ma_ban;
            console.log(this.props.location)
            var trang_thai_goi_mon = this.props.location.state.trang_thai_goi_mon;
            firebase.database().ref('/goi_mon/' + key).on("value", (database) => {
                this.setState({
                    trang_thai: database.val().trang_thai
                });
                var tam = database.val();
                delete tam.trang_thai;
                // tam = Object.values(tam);
                this.setState({
                    hoa_don: tam.mon,
                    ma_hoa_don: this.props.location.state.id_goi_mon,
                    ban,
                    id_ban: ma_ban,
                    trang_thai_goi_mon
                })
            })
        } else {
            this.setState({
                error: 'Bạn chưa chọn bàn. Vui lòng chọn bàn trước'
            })
            this.props.history.push({
                pathname: '/chon-ban-de-tinh-tien'
            })
        }
    }
    FormatGia(gia) {
        return <NumberFormat value={gia} displayType={'text'} thousandSeparator={true} />
    }
    TrTable(row, key) {
        return (<tr key={key}>
            <td className="">{row.ten_mon}</td>
            <td className="">{row.so_luong} </td>
            <td className="">{this.FormatGia(row.gia)} </td>
            <td className="">{this.FormatGia(row.gia * row.so_luong)} </td>
            <td className=""><img src={row.trang_thai ? ImgWaiting : ImgWDone} style={{ height: 20, width: 20 }} /> </td>
        </tr>
        )
    }
    handleClick() {
        if (this.state.dang_gui === false) {
            this.setState({
                dang_gui: true
            })
            var check_time = setInterval(() => {
                if (this.state.diem_nguoc >= 1)
                    this.setState({
                        diem_nguoc: this.state.diem_nguoc - 1
                    })
                if (this.state.diem_nguoc === 0) {
                    firebase.database().ref('/ban/' + this.state.id_ban + '/trang_thai'  ).set(true, (database) => {
                    })
                    firebase.database().ref('/goi_mon/' + this.state.ma_hoa_don + '/trang_thai'  ).set(true, (database) => {
                    })
                    firebase.database().ref('/ban/' + this.state.id_ban + '/goi_mon/'  ).set({trang_thai_goi_mon: 0, id_goi_mon: null}, (database) => {
                        this.setState({
                            trang_thai_goi_mon : 0
                        })
                    })
                    this.setState({
                        gui_thanh_cong: true
                    })
                    clearInterval(check_time);
                }
                //tat diem nguoc
                if (this.state.dang_gui === false) {
                    clearInterval(check_time);
                }
            }, 1000);
        }
        //Hủy lúc đang gọi
        if (this.state.dang_gui === true) {
            this.setState({
                dang_gui: false,
                diem_nguoc: 3
            })
        }
    }
    handleClickPrint(e){
        window.print()
        e.preventDefault()
    }
    ButtonGoiTinhTien() {
        if (this.state.ban !== '' && this.state.trang_thai_goi_mon === 3) {
            let t = '';
            if (this.state.dang_gui) {
                if (this.state.gui_thanh_cong) {
                    t = (<>
                        <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClickPrint.bind(this)}>In Hóa Đơn</button>
                    </>)
                }
                else t = <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClick.bind(this)}>Hủy ({this.state.diem_nguoc})</button>
            }
            else {
                t = <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClick.bind(this)}>Thanh Toán</button>
            }
            return t;
        }
        else if  (this.state.gui_thanh_cong){
            return <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClickPrint.bind(this)}>In Hóa Đơn</button>
        }
        //kết thuc cập nhật id goi_mon cho ban
    }
    handleClickGoiMon() {
        return this.props.history.push({
            pathname: "/chon-mon",
        });
    }
    handleClickXacNhan() {
        firebase.database().ref('/ban/' + this.state.id_ban + '/goi_mon/trang_thai_goi_mon').set(2, (database) => {
            this.state.hoa_don.map((value, index) => {
                return value.trang_thai_goi = 2
            })
            // firebase.database().ref('/goi_mon/'+this.state.ma_hoa_don).set(this.state.hoa_don)
            // firebase.database().ref('/goi_mon/' + this.state.ma_hoa_don + '/mon')
            var newStateHoaDon = this.state.hoa_don
            newStateHoaDon.map((value, index) => {
                value.trang_thai = false
            })
            this.setState({
                hoa_don: newStateHoaDon
            })
            firebase.database().ref('goi_mon/' + this.state.ma_hoa_don + '/mon').set(this.state.hoa_don)
        })
    }
    ButtonXacNhan() {
        if (this.state.ban !== '' && this.state.trang_thai_goi_mon !== 3 && this.state.trang_thai_goi_mon !== 2 && this.state.trang_thai_goi_mon !== 0) {
            return <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClickXacNhan.bind(this)}>Xác Nhận</button>
        }
        else if (this.state.ban !== '' && this.state.trang_thai_goi_mon === 2) {
            // return <button type="button" className={"btn3d btn btn-warning btn-md"} onClick={this.handleClickXacNhan.bind(this)}></button>
        }
    }
    Ngay_Goi_Mon() {
        return false;
    }
    trangThaiHoaDon() {
        firebase.database().ref('/goi_mon/' + this.state.ma_hoa_don + '/trang_thai').on("value", (database) => {

            this.setState({
                trang_thai_hoa_don: database.val()
            })
            return console.log(database.val());
        })
    }
    handleClickResetBan() {
        console.log('reset button')
        if (this.state.id_ban)
            firebase.database().ref('ban/' + this.state.id_ban).update({
                trang_thai: true, goi_mon: {
                    id_goi_mon: null,
                    trang_thai_goi_mon: 0
                }
            })
    }
    render() {
        var html = [];
        var tong_tien = 0;
        var ma_hoa_don = this.state.ma_hoa_don;
        if (this.state.hoa_don.length > 0) {
            this.state.hoa_don.map((value, index) => {
                html.push(this.TrTable(value, index));
                tong_tien += value.so_luong * value.gia;
            })
            tong_tien = this.FormatGia(tong_tien);

        }
        return (
            <PrintProvider>
                <NoPrint>
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-offset-3 main">
                                <div className="col-12">
                                <Print single name="foo">
                                    <div className="row">
                                        <div className="col-4">
                                            <img className="img-responsive" alt="Invoce Template" style={{ height: 50, width: 50 }} src="http://www.prepbootstrap.com/Content/images/template/productslider/product_004.jpg" />
                                        </div>
                                        <div className="col-8 text-right">
                                            <h4 style={{ color: "#F81D2D" }}><strong>Trà Sữa</strong></h4>
                                            <p>54 ấp 14 Xã Tân Hào, Huyện Giồng Trôm</p>
                                            <p>+1 888 455 6677</p>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="row">
                                        <div className="col-12 text-center">
                                            <h2>{this.state.ban}</h2>
                                            <h5>{ma_hoa_don}{this.state.error}</h5>
                                        </div>
                                    </div>
                                    <br />
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th scope="col">Món</th>
                                                    <th scope="col">SL</th>
                                                    <th scope="col">ĐG</th>
                                                    <th scope="col">T.Tiền</th>
                                                    <th scope="col">TT</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {html}

                                            </tbody>
                                        </table>
                                        <p style={{ textAlign: "right" }}>{this.state.trang_thai_hoa_don}<strong>Tổng tiền: {tong_tien}VNĐ</strong></p>
                                    </div>
                                    </Print>
                                    <div>
                                        <div className="col-12">
                                            <p>{this.Ngay_Goi_Mon()}</p>
                                        </div>
                                        {this.ButtonXacNhan()}
                                        {this.ButtonGoiTinhTien()}
                                        <button className="btn3d btn btn-warning btn-md" onClick={this.handleClickResetBan}>Reset Bàn</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </NoPrint>
            </PrintProvider>
        )
    }
}

const mapStateToProps = (state) => {
    return { items: state.Ban }
}
const mapDispatchToProps = dispatch => ({
    // fetch_ban_success: () => dispatch(fetch_ban_success()),
})
export default connect(mapStateToProps, mapDispatchToProps)(XemHoaDon);