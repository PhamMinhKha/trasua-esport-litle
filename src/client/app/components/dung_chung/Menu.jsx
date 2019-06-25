import React, { Component } from 'react'
import { Navbar, Nav, Col } from 'react-bootstrap'
import background from './../../../public/images/local/background menu.jpg'
import {Link, withRouter} from 'react-router-dom'
import PropTypes from "prop-types";
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state= {
            xas : false
        }
        this.handleClick = this.handleClick.bind(this);
        this.handleClickXemBan = this.handleClickXemBan.bind(this);
    }
    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      };
    componentDidMount(){
        let xas = localStorage.getItem('isAdmin')
        if(xas){
            this.setState({
                xas: true
            })
        }
    }
    componentWillReceiveProps(){
        let xas = localStorage.getItem('isAdmin')
        if(xas){
            this.setState({
                xas: true
            })
        }
    }
    handleClick (){
        localStorage.removeItem('isAdmin');
        this.setState({
            xas: false
        })
        return this.props.history.push({
            pathname:'/'
        })
    }
    buttonThoat(){
        
        if(this.state.xas){
            return (<button className="btn btn-danger" onClick={this.handleClick}>Thoát</button>)
        }
    }
    handleClickXemBan(){

    }
    MenuKhac(){
        if(this.state.xas){
            return (<>
                <Link to="/chon-ban-de-tinh-tien" className="nav-link" style={{display: "inline"}}><button className="btn btn-success nav-link" >Xem bàn</button></Link>
                </>
            )
        }
    }
    render() {
        return (
            <Col style={BG}>
                <Navbar variant="dark" >
                {/* <button className="btn btn-danger">Trà Sữa</button> */}
                    <Col  md={{ span: 3, offset: 3 }} sm={{ span: 3, offset: 3 }} >
                        <Nav.Link href="#chon-mon"><button className="btn btn-success" style={{display: this.state.xas ? "none": "block"}}>Chọn Món</button></Nav.Link>
                        {this.MenuKhac()}
                    </Col>
                    <Col  md={{ span: 3, offset: 3 }} sm={{ span: 3, offset: 3 }} >
                    <Nav.Link href="#hoa-don"><button className="btn btn-danger" style={{display: this.state.xas ? "none": "block"}}>Hóa Đơn</button></Nav.Link>
                    {this.buttonThoat()}
                    </Col>
                </Navbar>
            </Col>
        )
    }
}
const BG = {
    backgroundImage: 'url(' + background + ')',
}
export default withRouter(Menu) 