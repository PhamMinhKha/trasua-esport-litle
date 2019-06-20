import React, { Component } from 'react';
import firebase from './../config/FireBase';
import DoiBan from './dung_chung/DoiBan.jsx';
import NumberFormat from 'react-number-format';
import { connect } from 'react-redux';
import { them_mon_vao_gio_hang, xoa_mon_khoi_gio_hang, thay_doi_so_luong_mon_trong_gio_hang, XOA_CAC_MON_TRONG_REDUCER, XOA_CAC_MON_TRONG_REDUCER_X} from './../actions/actions';
import FloatGioHang from './FloatGioHang.jsx';

class ChonMon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mon: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.SoLy = this.SoLy.bind(this);
        this.handleClickCong = this.handleClickCong.bind(this);
        this.handleClickTru = this.handleClickTru.bind(this);
    }
    componentWillMount() {
        firebase.database().ref('mon').on("value", (database) => {
            database = Object.entries(database.val());
            var result = database.map((value,index)=>{
                value[1].duoc_chon = false;
                value[1].so_luong = 0;
                return value;
            })
            this.setState({
                mon: result
            });
            // firebase.database().ref('mon').off('value');
        })
        this.props.xoa_cac_mon_trong_reducer();
        let ban = localStorage.getItem('ban')
        if(!ban){
            return this.props.history.push({
                pathname:'chon-ban'
            })
        }
        let ma_hoa_don = localStorage.getItem('hoa_don')
        if(ma_hoa_don){
            firebase.database().ref('goi_mon/' + ma_hoa_don).on("value", (database) => {
                const Array = Object.values(database.val())
                Array.splice(-1,1);
                Array.map((value, index) =>{
                   let mon = [];
                   mon[0]=index;
                   mon[1]=value;
                    this.props.them_mon_vao_gio_hang(mon)
                })
            })
        }
       
    }
    componentWillUnmount(){
        firebase.database().ref().off()
        // firebase.database().goOffline()
    }
    handleClick(id, trang_thai) {
        let xoa_mon = false;
        let mon_duoc_chon = this.state.mon.filter((value, index) => {
            if (value[0] === id) {
                var newState= this.state.mon;
                if(newState[index][1].duoc_chon === true)//xóa ra khỏi giỏ hàng
                {
                    this.props.xoa_mon_khoi_gio_hang(id);
                    xoa_mon = true;
                }
                else {
                    newState[index][1].so_luong = 1;
                }
                newState[index][1].duoc_chon = !newState[index][1].duoc_chon;
                this.setState({mon: [...newState]});
                return value;
            }
        });
        if(!xoa_mon)
        this.props.them_mon_vao_gio_hang(mon_duoc_chon[0]);
    }
    handleClickCong(Mon){
        
        let mon_duoc_chon = this.state.mon.filter((value, index) => {
            if (value[0] === Mon[0]) {
                var newState= this.state.mon;
                newState[index][1].so_luong = newState[index][1].so_luong + 1;
                this.setState({mon: [...newState]});
                Mon.change = 1;
                this.props.thay_doi_so_luong_mon_trong_gio_hang(Mon);
                return value
            }
        })
    }
    handleClickTru(Mon){
        
        let mon_duoc_chon = this.state.mon.filter((value, index) => {
            if (value[0] === Mon[0]) {
                var newState= this.state.mon;
                if(newState[index][1].so_luong > 1)
                newState[index][1].so_luong = newState[index][1].so_luong - 1;
                this.setState({mon: [...newState]});
                Mon.change = -1;
                this.props.thay_doi_so_luong_mon_trong_gio_hang(Mon);
                return value
            }
        })
    }
    SoLy(value,trang_thai,so_luong){
        var html = [];
        if(trang_thai === 'success')
        {
            html.push(<div className="" key={so_luong}> <span>Số Ly: {so_luong} </span><button type="button" onClick={() => this.handleClickCong(value)} className={"btn3d btn btn-default btn-sm"}>+</button><button type="button" onClick={() => this.handleClickTru(value)} className={"btn3d btn btn-default btn-sm"}>-</button></div>)
        }
        return(<div className="">{html}</div>)
    }
    taoMon = () => {
        var mon = this.state.mon;
        let danh_sach_mon = [];
        if (mon != null) {
            mon.map((value, index) => {
                let Mon= this.props.items;
                let trang_thai = (value[1].duoc_chon === true) ? 'success':'default';
                danh_sach_mon.push(
                    <div className="row mot_dong_mon_an" key={value[0]}>
                        <div className="col-4">
                            < img className={"btn3d btn btn-" + trang_thai + " btn-lg img_chon_mon"} onClick={() => this.handleClick(value[0], value[1].trang_thai)} name={value[0]} value={value[0]} src={value[1].hinh} alt="" style={{ width: 85, height: 85, display: "block" }} />
                        </div>
                        <div className="col-8">
                            <span className="ten_mon text-justify">{value[1].ten_mon} </span><br />
                            <NumberFormat value={value[1].gia} displayType={'text'} thousandSeparator={true} renderText={value => <div className="gia">{value}VNĐ</div>} />
                            <p className="text-left" style={{display: value[1].duoc_chon ? 'none':'block'}}>{value[1].mo_ta}</p>
                            <div className="col-12 padding_zero">
                                {
                                   this.SoLy(value,trang_thai, value[1].so_luong)
                                }
                        </div>
                        </div>
                    </div>

                );
            })
            return danh_sach_mon;
        }
    }
    Tong_Tien = () =>{
        let t = 0;
        this.props.items.map((value, index) =>{
            t += value[1].gia * value[1].so_luong
        })
        return  <NumberFormat key="tong_tien
        " value={t} displayType={'text'} thousandSeparator={true} renderText={value => <div className="gia">{value}VNĐ</div>} />
    }
    render() {
        return (
            <div className="margin-bottom-100px">
                <DoiBan history={this.props.history}/>
                <hr/>
                {this.taoMon()}
                <FloatGioHang tong_tien={this.Tong_Tien()}  history={this.props.history} goi_mon={this.props.items}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { items: state.Mon }
}
const mapDispatchToProps = dispatch => ({
    them_mon_vao_gio_hang: (mon_moi) => dispatch(them_mon_vao_gio_hang(mon_moi)),
    xoa_mon_khoi_gio_hang: (mon_duoc_chon) => dispatch(xoa_mon_khoi_gio_hang(mon_duoc_chon)),
    thay_doi_so_luong_mon_trong_gio_hang: (mon) => dispatch(thay_doi_so_luong_mon_trong_gio_hang(mon)),
    xoa_cac_mon_trong_reducer: () => dispatch({type:XOA_CAC_MON_TRONG_REDUCER}),
})
export default connect(mapStateToProps, mapDispatchToProps)(ChonMon);
