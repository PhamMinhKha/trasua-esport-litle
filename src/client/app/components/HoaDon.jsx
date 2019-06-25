import React, { Component } from 'react';
import firebase from './../config/FireBase';
import './../../public/css/hoa_don.css';
import NumberFormat from 'react-number-format';
import {Alert} from 'react-bootstrap';
import { connect } from 'react-redux';
import { them_mon_vao_gio_hang, xoa_mon_khoi_gio_hang, thay_doi_so_luong_mon_trong_gio_hang, XOA_CAC_MON_TRONG_REDUCER, XOA_CAC_MON_TRONG_REDUCER_X} from './../actions/actions';
class HoaDon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hoa_don: [],
            dang_gui: false,
            diem_nguoc: 3,
            gui_thanh_cong: false,
            trang_thai: null,
            label_trang_thai: ''
        }
        this.TrTable = this.TrTable.bind(this);
        this.FormatGia = this.FormatGia.bind(this);
        this.Ngay_Goi_Mon = this.Ngay_Goi_Mon.bind(this);
        this.ButtonGoiTinhTien = this.ButtonGoiTinhTien.bind(this);
        
    }
    componentDidMount() {
        var hoa_don = localStorage.getItem('hoa_don');
        if (this.props.location.state)
            var key = this.props.location.state.id_goi_mon;
        else if (hoa_don === null) return false;
        else if (hoa_don !== null) key = hoa_don;
        if(key){
        firebase.database().ref('/goi_mon/' + key).on("value", (database) => {
            this.setState({
                trang_thai: database.val().trang_thai
            });
            var tam = database.val();
            delete tam.trang_thai;
            
            this.setState({
                hoa_don: tam.mon
            })
            this.props.xoa_cac_mon_trong_reducer();
            this.state.hoa_don.map((value, index)=>{
                this.props.them_mon_vao_gio_hang(value)
            })
            this.trangThaiHoaDon();
        })}
        else{
            
        }
    }

    trangThaiHoaDon(){
        let trang_thai_cua_ban = 0
        firebase.database().ref('ban/'+localStorage.getItem('ban')+'/goi_mon').on("value", (database)=>{
            trang_thai_cua_ban = database.val().trang_thai_goi_mon
            let tam = ''
        switch(trang_thai_cua_ban)
        {
            case 1: tam = "Nhân viên đã nhận được yêu cầu gọi món của bạn"; break;
            case 2: tam = "Đã phục vụ"; break;
            case 3: tam = "Nhân viên đang đến bạn vui lòng đợi"; break;
            default: tam = '';break;
        }
        this.setState({
            label_trang_thai: tam
        })
        })
        
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
        //cập nhật id goi_mon cho ban
       
        //vào hàm rồi đó bạn
        //b còn mắc vde gi k;
        // hàm click mới vào mà. cái này nó tự chạy
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
                    this.setState({
                        gui_thanh_cong: true
                    })
                    var so_ban = localStorage.getItem('ban');
                    if (so_ban) {
                        var data = firebase.database().ref('ban/' + so_ban + '/goi_mon/trang_thai_goi_mon').set(3);
                    } else {
                        this.props.history.push({
                            pathname: "/chon-ban",
                        });
                    }
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
    ButtonGoiTinhTien = () => {
        
        let t = '';
        if (this.state.dang_gui) {
            if (this.state.gui_thanh_cong) {
                t = <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClick.bind(this)}>Gọi Nhân Viên</button>
            }
            else t = <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClick.bind(this)}>Hủy ({this.state.diem_nguoc})</button>
        }
        else {
            t = <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClick.bind(this)}>Gọi Tính Tiền</button>
        }
        return t;
        //kết thuc cập nhật id goi_mon cho ban
    }
    handleClickGoiMon()
    {
        return this.props.history.push({
            pathname: "/chon-mon",
        });
    }
    Ngay_Goi_Mon() {
        return false;
    }
    render() {
        var html = [];
        var tong_tien = 0;
        var ma_hoa_don = '';
        if (this.state.hoa_don.length > 0) {
            this.state.hoa_don.map((value, index) => {
                console.log(value)
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
                                    <h2>Hóa Đơn</h2>
                                    <h5>{ma_hoa_don}</h5>
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
                                <p style={{ textAlign: "right" }}><strong>Tổng tiền: {tong_tien}VNĐ</strong></p>
                                <Alert key="thongBao" variant="success">{this.state.label_trang_thai}</Alert>
                            </div>
                            <div>
                                <div className="col-12">
                                    <p>{this.Ngay_Goi_Mon()}</p>
                                </div>
                                <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClickGoiMon.bind(this)}>Gọi món</button>
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
    return { items: state.Mon }
}
const mapDispatchToProps = dispatch => ({
    them_mon_vao_gio_hang: (mon_moi) => dispatch(them_mon_vao_gio_hang(mon_moi)),
    xoa_cac_mon_trong_reducer: () => dispatch({type:XOA_CAC_MON_TRONG_REDUCER}),
})
export default connect(mapStateToProps, mapDispatchToProps)(HoaDon);
