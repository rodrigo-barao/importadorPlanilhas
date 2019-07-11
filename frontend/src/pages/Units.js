import React, { Component } from 'react';
import api from '../services/api';
import Dropzone from 'react-dropzone';

export default class Units extends Component {
    constructor(props) {
        super(props);

        this.sendRequest = this.sendRequest.bind(this);
    }

    state = {
        files: [],
    }

    sendRequest = async (files) => {
        const data = new FormData();
        files.forEach((file) => {
            data.append('files', file);
        });

        await api.post(`/uploadUnits`, data);
        // const response = await api.post(`/uploadUnits`, data);
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={this.sendRequest}>
                    { ({ getRootProps, getInputProps }) => (
                        <div className="form-input" {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Arraste arquivos ou clique aqui</p>
                        </div>
                    )}
                </Dropzone>
                <a href="/" className="btn btn-info">Voltar</a>
            </div>
        );
    }
}
