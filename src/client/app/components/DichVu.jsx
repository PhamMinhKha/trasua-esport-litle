import React, { Component } from 'react';

class DichVu extends Component{
    render() {
        var ban = [];
        for( var i = 1; i<=10 ; i++)
        {
            ban.push(<button type="button" key={i} className="btn3d btn btn-primary btn-lg"><img src="/icons/ban.png" style={{width:50, height:50, display: "block"}}/> Bàn {i}</button>);
        }
        return (
            <div>
            {ban}
            </div>
        )
    }
}

export default DichVu;