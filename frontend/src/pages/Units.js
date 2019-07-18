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
        const dropzoneStyle = {
            'marginLeft': '3%',
            border : "2px solid black",
            display: 'inline-flex',
            borderRadius: '5px',
            width: '93%',
            height: '200px',
            padding: '4',
            boxSizing: 'border-box'
        };

        const titleStyle = {
            'marginLeft': '30%',
            'color': 'black',
        }

        const backButton = {
            'marginLeft': '4%',
            'marginTop': '10px',
        }

        return (
            <div>
                <div id="dropzone" className="row">
                    <h1 style={titleStyle}>Você deve enviar apenas a planilha (.csv)</h1>
                    <Dropzone className="row" onDrop={this.sendRequest} style={dropzoneStyle}>
                        { ({ getRootProps, getInputProps }) => (
                            <div className="form-input" {...getRootProps()} style={dropzoneStyle}>
                                <input {...getInputProps()} />
                                <p>&nbsp;&nbsp;Arraste arquivos ou clique aqui</p>
                            </div>
                        )}
                    </Dropzone>
                </div>
                <div id="buttons" className="row">
                    <a href="/" className="btn btn-info col-md-2" style={backButton}>Voltar</a>
                    <a href="/charges" hidden onClick={this.deleteFile} className="btn btn-danger" style={backButton}>Deletar arquivo</a>
                    {(this.state.hasError) ?
                        <div className="alert alert-danger">{this.state.errorMsg}</div>
                        : <div></div>
                    }
                </div>
            </div>
        );
    }
}
