import React, { Component } from 'react';

//connect redux saga
import { connect } from 'react-redux';
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ban: 'Chưa Chọn'
        };
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount(){
        let ban = localStorage.getItem('ban');
        this.setState({
            ban
        })
    }
    handleClick() {
        return this.props.history.push({
            pathname: "/",
        });
    }
    render() {  
        var ban = this.state.ban;
        return (
            <div>
                Bạn Đang Chọn Bàn Số {ban} <button type="button" onClick={() => this.handleClick()} className={"btn3d btn btn-default btn-sm"}>Đổi bàn</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { items: state.Ban }
  }
  const mapDispatchToProps = dispatch => ({
  })
  export default connect(mapStateToProps, mapDispatchToProps)(Header);