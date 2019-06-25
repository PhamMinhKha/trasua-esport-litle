import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import firebase from './../../config/FireBase'
const schema = {
    title: "Đăng Nhập",
    type: "object",
    required: ["user", "password"],
    properties: {
      user: {type: "string", title: "Tài khoản", default: ""},
      password: {type: "string", title: "Mật Khẩu", default: ""},
    }
  };
const uiSchema = {
    password:{
        "ui:widget": "password"
    }
  };
const log = (type) => console.log.bind(console, type);
class DangNhap extends Component{
    constructor(props) {
        super(props);
        this.state = {
            thong_bao: ''
        };
        this.hanldeSubmit = this.hanldeSubmit.bind(this);

    }
    componentDidMount(){
        let t = localStorage.getItem('isAdmin')
        if( t )
        {
            return this.props.history.push({
                pathname: '/chon-ban-de-tinh-tien'
            });
        }
    }
    hanldeSubmit(formData, e){
        var {user, password} = formData.formData
        if(user === "admin" && password === "admin"){
            localStorage.setItem("isAdmin" , true)
            return this.props.history.push({
                pathname: '/chon-ban-de-tinh-tien'
            });
        }
        else {
            this.setState({
                thong_bao: "Tài khoản hoặc mật khẩu không đúng vui lòng nhập lại"
            })
        }
    }
      
    render(){
        return (
            <Form schema={schema}
            uiSchema={uiSchema}
            onChange={log("changed")}
            onSubmit={this.hanldeSubmit}
            onError={log("errors")}>
                <p style={{color:"red"}}>{this.state.thong_bao}</p>
            <button className="btn btn-success">Đăng Nhập</button>
            </Form>
        )
    }
}
export default DangNhap;