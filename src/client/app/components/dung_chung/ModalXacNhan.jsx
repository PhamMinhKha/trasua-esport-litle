import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
class ModalXacNhan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
          }
          this.handleClick = this.handleClick.bind(this);
          this.handleShow = this.handleShow.bind(this)
          this.handleClose = this.handleClose.bind(this)
    }
    componentDidMount(){
        this.setState({
            show: this.props.show
        })
    }
    handleClick(path, id_goi_mon) {
        if(id_goi_mon)
        return this.props.history.push({
            pathname: path,
            state: { id_goi_mon }
        });
    }
    handleClose(){
        this.props.handleCloseModal();
        this.setState({
            show: false
        })
    }
    handleShow(){
        this.setState({
            show:true
        })
    }
    render() {
        var { tua_de, thong_bao, path, param, color } = this.props;
        return (
            <>
            <Modal show={this.props.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>tua_de</Modal.Title>
              </Modal.Header>
              <Modal.Body>thong_bao</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Đóng
                </Button>
                <Button variant="primary" onClick={() => this.handleClick(path, param)}>
                  Xem Hóa Đơn
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )
    }

}
ModalXacNhan.propTypes = {
    show: PropTypes.bool
}
export default ModalXacNhan