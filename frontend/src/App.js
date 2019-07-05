import React, { Component } from 'react';
import api from './services/api';
import Dropzone from 'react-dropzone';
// import axios from 'axios';
// import { BrowserRouter, Switch, Route } from 'react-router-dom';

import './bootstrap.min.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.sendRequest = this.sendRequest.bind(this);
    }

    state = {
        files: [],
    }

    sendRequest = (files) => {
        const data = new FormData();
        files.forEach((file) => {
            console.log(file);
            data.append('files', file);

        });
        const response = api.post(`/uploadCobranca`, data);

        console.log(response);
    }

    render() {
        return (
            <div className="form-control">
                <Dropzone onDrop={this.sendRequest}>
                    { ({ getRootProps, getInputProps }) => (
                        <div className="form-input" {...getRootProps()}>
                            <input {...getInputProps()} />

                            <p>Arraste arquivos ou clique aqui</p>
                        </div>
                    )}
                </Dropzone>
            </div>
        )
    }
}

export default App;
