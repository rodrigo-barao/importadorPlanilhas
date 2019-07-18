import React, { Component } from 'react';

export default class Home extends Component {
    render() {

        const titleStyle = {
            'marginLeft': '23%',
            'color': 'black',
        }

        return (
            <div>
                <h1 style={titleStyle}>Selecione o que deseja importar</h1>
                <div className="row">
                    <div className="col-md-1"></div>
                    <a href="/charges" className="btn btn-info col-md-3">Cobranças</a>
                    <div className="col-md-1"></div>
                    <a href="/units" className="btn btn-info col-md-3">Unidades</a>
                </div>
            </div>
        );
    }
}
