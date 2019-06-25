import React, { Component } from 'react';
import firebase from './../../config/FireBase';
import imgBan from './../../../public/icons/ban.png';
import imgTinhTien from './../../../public/icons/g14250-512.png';
import imgGoiMon from './../../../public/icons/PromoStandards Invoice B.png';
//connect redux saga
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import { fetch_ban_success } from './../../actions/actions';
import {Col} from 'react-bootstrap'
import SoundCoHoaDonMoi from '../../../public/sounds/co hoa don moi.mp3';
import SoundCoBanGoiTinhTien from '../../../public/sounds/co ban goi tinh tien.mp3';
class ChonBanDeTinhTien extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ban: [],
            refresh: true
        };
        this.handleClick = this.handleClick.bind(this);
        this.ImgGoiMon = this.ImgGoiMon.bind(this);

    }
    componentDidMount() {
        let tam = localStorage.getItem('isAdmin')
        if(!tam)
        {
            this.props.history.push({
                pathname:'dang-nhap'
            })
        }
        firebase.database().ref('/ban/').on("value", (database) => {
            this.setState({
                ban: database.val()
            })
        })
    }
    handleClick(value, i) {
        console.log(value)
        if (value.goi_mon) {
            var id_goi_mon = value.goi_mon.id_goi_mon;
            return this.props.history.push({
                pathname: "/xem-hoa-don",
                state: { id_goi_mon, ban: value.ten_ban, ma_ban: i, trang_thai_goi_mon: value.goi_mon.trang_thai_goi_mon }
            });
        }
        else return false;
    }
    soundAlert(trang_thai) {
        
        switch (trang_thai) {
            case 1: var audio = new Audio(SoundCoHoaDonMoi); break;

            case 3: var audio = new Audio(SoundCoBanGoiTinhTien); break;
        }
        if (audio && this.state.refresh) {
            audio.play();
        }
        return false;
    }
    ImgTinhTien(goi_tinh_tien) {
        if (goi_tinh_tien && goi_tinh_tien.trang_thai_goi_mon === 3)
           { this.soundAlert(3);
            return <img src={imgTinhTien} className="iconTinhTien" />}
        else return '';
    }
    ImgGoiMon(value) {
        // console.log(value);
        if (value) {
            if (value.trang_thai_goi_mon === 1)//dang goi mon
            {
                this.soundAlert(1);
                return <img src={imgGoiMon} className="iconTinhTien" />
            }
        }
        else return '';
    }
    render() {
        var ban = this.state.ban;
        return (< div className="row">  {ban.map((value, i) => {
            let trang_thai = (value.trang_thai === true) ? 'default' : 'success';
            let text_trang_thai = '';
            if (value.goi_mon)
                switch (value.goi_mon.trang_thai_goi_mon) {
                    case 1: trang_thai = 'success';
                        text_trang_thai = "Gọi Món"; break; // goi mon
                    case 2: trang_thai = 'danger';
                        text_trang_thai = "Đã phục vụ"; break; // da phu vu
                    case 3: trang_thai = 'primary';
                        text_trang_thai = "Tính Tiền"; break; //goi phuc vu
                    case 4: trang_thai = 'info';
                        text_trang_thai = "Gọi phục vụ"; break;// goi tinh tien
                }
            return <Col xs={4} sm={4} md={2} key={i}>< button type="button" onClick={() => this.handleClick(value, i)} key={i} name={value.vi_tri} value={value.trang_thai} className={"btn3d btn btn-" + trang_thai + " btn-lg ImgCha"} >
                < img src={imgBan} alt="" style={{ width: 50, height: 50, display: "block" }} />
                {value.ten_ban} 
                {/* {text_trang_thai} */}
                {this.ImgTinhTien(value.goi_mon)}{this.ImgGoiMon(value.goi_mon)}
            </button ></Col>
        })
        
        } </div >
        )
    }
}

const mapStateToProps = (state) => {
    return { items: state.Ban }
}
const mapDispatchToProps = dispatch => ({
    // fetch_ban_success: () => dispatch(fetch_ban_success()),
})
export default connect(mapStateToProps, mapDispatchToProps)(ChonBanDeTinhTien);