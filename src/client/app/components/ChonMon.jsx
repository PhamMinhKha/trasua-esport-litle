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
            mon: null,
            mon_duoc_chon: [],
            mon_da_goi: []

        };
        this.handleClick = this.handleClick.bind(this);
        this.SoLy = this.SoLy.bind(this);
        this.handleClickCong = this.handleClickCong.bind(this);
        this.handleClickTru = this.handleClickTru.bind(this);
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
        // this.props.xoa_cac_mon_trong_reducer();
        let ban = localStorage.getItem('ban')
        if(!ban){
            return this.props.history.push({
                pathname:'chon-ban'
            })
        }
        let ma_hoa_don = localStorage.getItem('hoa_don')
        if(ma_hoa_don){
            firebase.database().ref('goi_mon/' + ma_hoa_don + '/mon').on("value", (database) => {
                const Array = database.val()
                Array.map((value, index) =>{
                   let mon = [];
                    this.state.mon_da_goi.push(value)
                    // this.props.them_mon_vao_gio_hang(mon)
                })
            })
        }
       
    }
    componentWillUnmount(){
        firebase.database().ref().off()
        // firebase.database().goOffline()
    }
    handleClick(id, mon, trang_thai) {
        var monRemix = mon
        monRemix.id_mon = id
        monRemix.so_luong = 1
        var newState = this.state.mon_duoc_chon.filter((value, index)=>{
            if(value.id_mon === id){
                return value
            }
        })
        if(!newState.length) // không tìm thấy món đó trong state mon_duoc_chon
        {
            var stateMonDuocChon = this.state.mon_duoc_chon
            stateMonDuocChon.push(monRemix)
            this.setState({mon_duoc_chon: stateMonDuocChon})
        }else {// tìm thấy món đó trong state mon_duoc_chon và xóa nó đi
            var stateMonDuocChon = this.state.mon_duoc_chon.filter( value => value.id_mon !== id)
            this.setState({mon_duoc_chon: stateMonDuocChon})
        }
       console.log(newState)
    }
    handleClickCong(id_mon){
        
        let mon_duoc_chon = this.state.mon_duoc_chon.filter((value, index) => {
            if (value.id_mon === id_mon) {
                var newState= this.state.mon_duoc_chon;
                newState[index].so_luong = newState[index].so_luong + 1;
                this.setState({mon_duoc_chon: [...newState]});
                // this.props.thay_doi_so_luong_mon_trong_gio_hang(Mon);
                return value
            }
        })
    }
    handleClickTru(id_mon){
        
        let mon_duoc_chon = this.state.mon_duoc_chon.filter((value, index) => {
            if (value.id_mon === id_mon) {
                var newState= this.state.mon_duoc_chon;
                if(value.so_luong === 1)// xóa ra khỏi món được chọn
                {
                    newState = this.state.mon_duoc_chon.filter(value2 => value2.id_mon !== id_mon)
                }
                else 
                newState[index].so_luong = newState[index].so_luong - 1;
                this.setState({mon_duoc_chon: [...newState]});
                // this.props.thay_doi_so_luong_mon_trong_gio_hang(Mon);
                return value
            }
        })
    }
    SoLy(id_mon){
        var html = [];
        let mon_duoc_chon = this.state.mon_duoc_chon.map((value, index)=>{
            if(value.id_mon === id_mon)
            {
                let {trang_thai, so_luong} = value
                html.push(<div className="" key={id_mon}> <span>Số Ly: {so_luong} </span><button type="button" onClick={() => this.handleClickCong(id_mon)} className={"btn3d btn btn-default btn-sm"}>+</button><button type="button" onClick={() => this.handleClickTru(id_mon)} className={"btn3d btn btn-default btn-sm"}>-</button></div>)
            }
        })
        return(<div className="">{html}</div>)
    }
    trangThaiChonMon(id_mon)
    {
        let mon = this.state.mon_duoc_chon.filter( value => value.id_mon === id_mon)
        if(mon.length){
            return true
        }
        else {
            return false
        }
    }
    taoMon = () => {
        var mon = this.state.mon;
        let danh_sach_mon = [];
        if (mon != null) {
            mon.map((value, index) => {
                let Mon= this.props.items;
                // let trang_thai = (value[1].duoc_chon === true) ? 'success':'default';
                let trang_thai = (this.trangThaiChonMon(value[0])) ? 'success':'default';
                danh_sach_mon.push(
                    <div className="row mot_dong_mon_an" key={value[0]}>
                        <div className="col-4 col-sm-3">
                            < img className={"btn3d btn btn-" + trang_thai + " btn-lg img_chon_mon"} onClick={() => this.handleClick(value[0], value[1], value[1].trang_thai)} name={value[0]} value={value[0]} src={value[1].hinh} alt="" style={{ width: 85, height: 85, display: "block" }} />
                        </div>
                        <div className="col-8 col-sm-9">
                            <span className="ten_mon text-justify">{value[1].ten_mon} </span><br />
                            <NumberFormat value={value[1].gia} displayType={'text'} thousandSeparator={true} renderText={value => <div className="gia">{value}VNĐ</div>} />
                            <p className="text-left" style={{display: value[1].duoc_chon ? 'none':'block'}}>{value[1].mo_ta}</p>
                            <div className="col-12 padding_zero">
                                {
                                   this.SoLy(value[0])
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
        if(this.state.mon_duoc_chon)
       { this.state.mon_duoc_chon.map((value, index) =>{
            t += value.gia * value.so_luong
        })
        return  <NumberFormat key="tong_tien
        " value={t} displayType={'text'} thousandSeparator={true} renderText={value => <div className="gia">{value}VNĐ</div>} />}
    }
    render() {
        return (
            <div className="margin-bottom-100px">
                <DoiBan history={this.props.history}/>
                <hr/>
                {this.taoMon()}
                <FloatGioHang tong_tien={this.Tong_Tien()}  history={this.props.history} goi_mon={this.state.mon_duoc_chon} mon_da_goi={this.state.mon_da_goi}/>
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
