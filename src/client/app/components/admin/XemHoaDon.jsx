import React, { Component } from 'react';
import firebase from './../../config/FireBase';
import './../../../public/css/hoa_don.css';
import NumberFormat from 'react-number-format';
import {connect} from 'react-redux';
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
            ban:'',
            id_ban: '',
            trang_thai_goi_mon: 0,
            trang_thai_hoa_don: false
        }
        this.TrTable = this.TrTable.bind(this);
        this.FormatGia = this.FormatGia.bind(this);
        this.Ngay_Goi_Mon = this.Ngay_Goi_Mon.bind(this);
        this.ButtonGoiTinhTien = this.ButtonGoiTinhTien.bind(this);
    }
    componentDidMount() {
        if(this.props.location.state){
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
            tam = Object.values(tam);
            this.setState({
                hoa_don: tam,
                ma_hoa_don: this.props.location.state.id_goi_mon,
                ban,
                id_ban: ma_ban,
                trang_thai_goi_mon
            })
        })
    }else {
        this.setState({
            error: 'Bạn chưa chọn bàn. Vui lòng chọn bàn trước'
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
    ButtonGoiTinhTien () {
        if(this.state.ban !== '' && this.state.trang_thai_goi_mon === 3){
        let t = '';
        if (this.state.dang_gui) {
            if (this.state.gui_thanh_cong) {
                t = <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClick.bind(this)}>In Hóa Đơn</button>
            }
            else t = <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClick.bind(this)}>Hủy ({this.state.diem_nguoc})</button>
        }
        else {
            t = <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClick.bind(this)}>Thanh Toán</button>
        }
        return t;}
        //kết thuc cập nhật id goi_mon cho ban
    }
    handleClickGoiMon()
    {
        return this.props.history.push({
            pathname: "/chon-mon",
        });
    }
    handleClickXacNhan()
    {
        firebase.database().ref('/ban/' + this.state.id_ban + '/goi_mon/trang_thai_goi_mon'  ).set(2, (database) => {
            this.setState({
                trang_thai_goi_mon : 2
            })
            return console.log(database);
        })
    }
    ButtonXacNhan()
    {
        if(this.state.ban !== '' && this.state.trang_thai_goi_mon !== 3){
         return <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClickXacNhan.bind(this)}>Xác Nhận</button>
        }
    }
    Ngay_Goi_Mon() {
        return false;
    }
    trangThaiHoaDon(){
        firebase.database().ref('/goi_mon/' + this.state.ma_hoa_don + '/trang_thai'  ).on("value",(database) => {

            this.setState({
                trang_thai_hoa_don : database.val()
            })
            return console.log(database.val());
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
            <div className="container">
                <div className="row">
                    <div className="col-12 col-offset-3 main">
                        <div className="col-12">
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {html}

                                    </tbody>
                                </table>
                                <p style={{ textAlign: "right" }}>{this.state.trang_thai_hoa_don}<strong>Tổng tiền: {tong_tien}VNĐ</strong></p>
                            </div>
                            <div>
                                <div className="col-12">
                                    <p>{this.Ngay_Goi_Mon()}</p>
                                </div>
                                {this.ButtonXacNhan()}
                                {this.ButtonGoiTinhTien()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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