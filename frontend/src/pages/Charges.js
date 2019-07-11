import React, { Component } from 'react';
import api from '../services/api';
import Dropzone from 'react-dropzone';

export default class Charges extends Component {
    sendRequest = async (files) => {
        const data = new FormData();
        files.forEach((file) => {
            data.append('files', file);
        });

        let response;
        try {
            response = await api.post(`/uploadCharges`, data);

            if (response.status >= 500) {
                this.setState({
                    hasError: true,
                    errorMsg: response.data,
                });
            }
        }
        catch (err) {
            return;
        }
    }

    constructor(props) {
        super(props);

        this.sendRequest = this.sendRequest.bind(this);

        this.state = {
            files: [],
            hasError: false,
            errorMsg: '',
        }
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
                {(this.state.hasError) ?
                    <div className="alert alert-danger">{this.state.errorMsg}</div>
                    : <div></div>
                }
            </div>
        );
    }
}
