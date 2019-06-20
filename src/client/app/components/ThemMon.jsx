import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from './../config/FireBase';
import DatabaseReference from './../config/FireBase';
import '../../public/css/form_them_ban.css'
class ThemMon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mon_moi: {
                ten_mon: '',
                gia: '',
                mo_ta:'',
                hinh:'',
                trang_thai:true
            },
            uploadSuccess: false,
            msg:''
          
        };
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
      
      handleChange(event) {
        let tam = event.target.name;
        this.setState({ mon_moi: { ...this.state.mon_moi, [tam]: event.target.value} });
      }
      handleUploadImage = (event)  =>{
        this.setState({
            mon_moi:{
                ...this.state.mon_moi, hinh: event.target.files[0]
            }
        });
      }
      handleSubmit(event) {
          var ten_mon = this.state.mon_moi.ten_mon + Math.floor(Math.random() * Math.floor(100));;
          var ref = firebase.storage().ref('/Images/' + ten_mon);
          var uploadTask = ref.put(this.state.mon_moi.hinh);
          uploadTask.on('state_changed', function(snapshot){

          }, function(error){
            //khong thanh cong
          }, () => {
            //thanh cong
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                var mon_moi = {...this.state.mon_moi}
                mon_moi.hinh = downloadURL;
                this.setState({mon_moi, uploadSuccess: downloadURL})
                const db = firebase.database().ref('mon');
                if(this.state.mon_moi.ten_mon == '' || this.state.mon_moi.gia == '') {
                    this.setState({msg:<span className="text-danger">Không được bỏ trống</span>});
                    event.preventDefault();
                    return;
                }
                db.push().set(this.state.mon_moi);
                // db.child("Victor").setValue("setting custom key when pushing new data to firebase database");
                // console.log(newPostKey);
                // db.ref('mon/' + this.state.ban_moi.vi_tri).set(this.state.ban_moi, (error) => {
                //     if(error)
                //     {
                //         this.setState({
                //             msg: 'Không thêm bàn mới được kiểm tra lại giữ liệu'
                //         })
                //     }
                //     else {
                //         this.setState({
                //             msg: 'Thêm mới thành công'
                //         })
                //     }
                // });
            });
          }
          );
        
          event.preventDefault();
          

      }
    
    render() {

        return (
            <div className="container">
                <div className="main">
                    <div className="main-center">
                        <h5>Thêm món mới vào quán</h5>
                        <form className="" onSubmit={this.handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="name">Tên Món Mới</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="ten_mon" value={this.state.mon_moi.ten_mon} onChange={this.handleChange}  />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Giá</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-envelope fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="gia" value={this.state.mon_moi.gia} onChange={this.handleChange}  />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="username">Mô tả món</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-users fa" aria-hidden="true"></i></span>
                                    <input type="text" className="form-control" name="mo_ta" value={this.state.mon_moi.mo_ta} onChange={this.handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Hình</label>
                                <div className="input-group">
                                    <span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
                                    <input type="file" className="form-control" name="hinh"  onChange={this.handleUploadImage}  />
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

export default ThemMon;