const csv = require('csv-parser');
const fs = require('fs');

var results = [];

module.exports = {
    async processarUnidadeAction(req, res) {
        if (req.files.length != 1) {
            res.json("Você não pode enviar mais de um arquivo");
        }

        console.log(req.files);

        // if ()

        readFile(req.files[0].path, importType = null);

        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        res.json("Sucesso");
    },
};

function readFile(filePath) {
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        processarCsv(results);
    });
}

function processarCsv (results) {
    var csvOutput = [];

    results.forEach(function (line, key) {
        var lineOutput = {
            bloco: line['apart_bloco'],
            unidade: line['apart_apto'],
            fração: line['apart_fracao'],

            proprietário_nome: line['propriet_nome'],
            proprietário_endereço: line['propriet_endereco'],
            proprietário_bairro: line['propriet_bairro'],
            proprietário_cep: line['propriet_cep'],
            proprietário_cidade: line['propriet_cidade'],
            proprietário_telefone: joinTwoDatas(line['propriet_fonec'], line['propriet_foner']),
            proprietário_estado: line['propriet_celular'],
            proprietário_email: joinTwoDatas(line['propriet_mail'], line['propriet_mail2']),
            proprietário_rg: line['propriet_rg'],
            proprietário_cpf: line['propriet_doc/cnpj'],

            inquilino_nome: line[''],
            inquilino_telefone: line[''],
            inquilino_celular: line[''],
            inquilino_forma_de_entrega: line[''],
            'inquilino_cpf/cnpj': line[''],
            inquilino_rg: line[''],
            inquilino_email: line['']

        };

        csvOutput.push(lineOutput);
    });

    fs.writeFile('./src/files/output/exemploUnidade.csv', convertToCsv(csvOutput),{enconding:'utf-8',flag: 'a'}, function (err) {
        if (err) throw err;
        console.log('Arquivo salvo!');
    });
}

function convertToCsv(data) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    csv = csv.join('\r\n');

    return csv;
}

function joinTwoDatas(field1, field2) {
    if (!field1 && !field2) {
        return ''
    } else if (!field1 || !field2) {
        return String(field1) + String(field2);
    } else {
        return String(field1) + ';' + String(field2);
    }
}

function getPhone(phone1, phone2) {
    if (!phone1 && !phone2) {
        return ''
    } else if (!phone1 || !phone2) {
        return String(phone1) + String(phone2);
    } else {
        return String(phone1) + ';' + String(phone2);
    }
}
