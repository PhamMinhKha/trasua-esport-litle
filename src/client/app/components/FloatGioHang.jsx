import React, { Component } from 'react';
import firebase from './../config/FireBase';
import ImgBG from './../../public/images/local/background_float_gio_hang.jpg'
class FloatGioHang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            diem_nguoc: 3,
            dang_gui: false,
            error: null
        }
        this.handleClick = this.handleClick.bind(this);
        this.ButtonChange = this.ButtonChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
        this.TaoMaKhachHang = this.TaoMaKhachHang.bind(this);
        this.CapNhatIDGoiMonChoBanDuocChon = this.CapNhatIDGoiMonChoBanDuocChon.bind(this);
    }
    handleClick() {
        //check xem trong order co mon chua
        if (this.props.tong_tien.props.value === 0) {
            return false;
        }
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
                    this.handleRedirect();
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
        console.log(this.state)
    }
    CapNhatIDGoiMonChoBanDuocChon(id_goi_mon) {
        //cập nhật id goi_mon cho ban
        var so_ban = localStorage.getItem('ban');
        if (so_ban) {
            var data = firebase.database().ref('ban/' + so_ban);
            /*
                1: goi phuc vu
                2: phuc vu xac nhan va dang thuc hien
                3: da phuc vu
            */
            data.update({ trang_thai: false, goi_mon:{trang_thai_goi_mon: 1, id_goi_mon} });
            // data.child('goi_mon').set({ trang_thai_goi_mon: 1, id_goi_mon });
            // console.log(2)
        } else {
            //chưa chọn bàn
        }
        return true;
        //kết thuc cập nhật id goi_mon cho ban
    }
    handleRedirect() {
        var d = new Date();
        var time = d.getTime();
        const db = firebase.database().ref('goi_mon');
        var mon_duoc_goi = {};
        mon_duoc_goi.mon = []
        var mon_moi = {};
        let i = 1
        this.props.goi_mon.map((value, index) => {
            i++
            mon_moi = value;
            mon_moi.time = time;
            mon_moi.id_mon = value.id_mon;
            mon_duoc_goi.trang_thai = false;
            mon_duoc_goi.mon.push(mon_moi)
        })
        console.log(i)
        console.log(mon_duoc_goi)
        //kiem tra xem hoa don goi mon da thanh toan hay chua
        //neu chua thanh toan thi cap nhat con da thanh toan thi them moi
        var ma_goi_mon = localStorage.getItem('hoa_don');
        let da_thanh_toan = false;
        if (ma_goi_mon !== null) { // đã gọi món trước đó
            let db_goi_mon = firebase.database().ref('/goi_mon/' + ma_goi_mon).once("value", (database) => {
                this.CapNhatIDGoiMonChoBanDuocChon(ma_goi_mon);
                let hoa_don = database.val();
                if (hoa_don.trang_thai === false) {
                    da_thanh_toan = false;
                    var mon_da_goi = this.props.mon_da_goi
                    mon_duoc_goi.mon.map((value, index) =>{
                        mon_da_goi.push(value)
                    })
                    console.log(mon_da_goi)
                    // return ''
                     let db_goi_mon = firebase.database().ref('/goi_mon/' + ma_goi_mon + '/mon/').set(mon_da_goi).then((value)=>{
                        return this.props.history.push({
                            pathname: "/hoa-don"
                        });
                    });
                }
                else da_thanh_toan = true;
            })
        }else
         { // chưa gọi món
            mon_duoc_goi = Object.assign({}, mon_duoc_goi);
            console.log(mon_duoc_goi)
            firebase.database().ref('/goi_mon/').push(mon_duoc_goi)
             .then(res => {
                        console.log('them id goi mon vao ban');
                        localStorage.setItem('hoa_don', res.getKey());
                        this.TaoMaKhachHang(res.getKey());
                        this.CapNhatIDGoiMonChoBanDuocChon(res.getKey());
                        return this.props.history.push({
                            pathname: "/hoa-don",
                            state: { id_goi_mon: res.getKey() }
                        });
                    })
                    .catch(error => console.log(error));
        }
        // db.push().set(mon_duoc_goi).then( (doc, reject)=>{
        //     db.push().key
        // })
        // 
    }
    TaoMaKhachHang(id_hoa_don) {
        var d = new Date();
        var time = d.getTime();
        var khach = {
            id_hoa_don,
            time
        }
        var ma_khach_hang = localStorage.getItem('khach_hang');
        if (ma_khach_hang === null) {
            const db = firebase.database().ref('khach_hang');
            db.push()
                .then(res => {
                    localStorage.setItem('khach_hang', res.getKey());
                    const db = firebase.database().ref('khach_hang/' + res.getKey());
                    db.push().set(khach)
                        .then(res => {
                            return true;
                        })
                        .catch(error => console.log(error));
                    return true;
                })
                .catch(error => console.log(error));
        } else {
            const db = firebase.database().ref('khach_hang/' + ma_khach_hang);
            db.push().set(khach)
                .then(res => {
                    return true;
                })
                .catch(error => console.log(error));
        }


    }
    ButtonChange() {
        let t = '';
        if (this.state.dang_gui) {
            t = <button type="button" className={"btn3d btn btn-danger btn-md"} onClick={this.handleClick}>Hủy ({this.state.diem_nguoc})</button>
        }
        else {
            t = <button type="button" className={"btn3d btn btn-success btn-md"} onClick={this.handleClick}>Gọi Món</button>
        }
        return t;
    }
    render() {
        return (
            <div className="row col-12 on-top" style={bgStyle}>
                <div className="col-4" style={{position:"relative", top:20, color:"white", fontSize:16, fontWeight:"bold"}}>
                  Tổng tiền: {[this.props.tong_tien]}
                </div>
                <div className="col-6">
                    {this.ButtonChange()}
                </div>
            </div>
        )
    }
}
const bgStyle = {
    backgroundImage: 'url(' + ImgBG + ')',
  };
  
export default FloatGioHang;