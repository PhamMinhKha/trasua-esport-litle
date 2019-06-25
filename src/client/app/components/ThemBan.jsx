import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './../config/FireBase';
import '../../public/css/form_them_ban.css';
class ThemBan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ban_moi: {
                ten_ban: '',
                vi_tri: '',
                so_ghe:'',
                mo_ta:'',
                trang_thai:false
            },
            msg:''
          
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      handleChange(event) {
        let tam = event.target.name;
        this.setState({ ban_moi: { ...this.state.ban_moi, [tam]: event.target.value} });
      }
    
      handleSubmit(event) {
        const db = firebase.database();
        if(this.state.ban_moi.ten_ban == '') {
            this.setState({msg:<span className="text-danger">Không được bỏ trống tên bàn</span>});
            event.preventDefault();
            return;
        }
        db.ref('ban/' +this.state.ban_moi.vi_tri ).set(this.state.ban_moi, (error) => {
            if(error)
            {
                this.setState({
                    msg: 'Không thêm bàn mới được kiểm tra lại giữ liệu'
                })
            }
            else {
                this.setState({
                    msg: 'Thêm mới thành công'
                })
            }
        });
        event.preventDefault();
      }
    
    render() {

        return (
            <div className="container">
                <div className="main">
                    <div className="main-center">
                        <h5>Thêm bàn mới vào quán</h5>
                        <form className="" onSubmit={this.handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="name">Tên Bàn</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="ten_ban" value={this.state.ban_moi.ten_ban} onChange={this.handleChange}  />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Số Ghế</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-envelope fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="so_ghe" value={this.state.ban_moi.so_ghe} onChange={this.handleChange}  />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Vị Trí</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-users fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="vi_tri" value={this.state.ban_moi.vi_tri} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mô Tả</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="mo_ta" value={this.state.ban_moi.mo_ta} onChange={this.handleChange}  />
                                </div>
                            </div>
                            <h2>{this.state.msg}</h2>
                            <button type="submit" className="btn btn-success">Thêm</button>

                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default ThemBan;