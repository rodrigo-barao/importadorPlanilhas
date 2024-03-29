const csv = require('csv-parser');
const fs = require('fs');

module.exports = {
    async sendUnits(req, res) {
        if (!req.files) {
            return res.json("Nenhum arquivo enviado");
        }

        if (req.files.length != 1) {
            return res.json("Você não pode enviar mais de um arquivo");
        }

        await readFile(req.files[0].path, importType = null);

        await req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        var options = {
            root: '/home/bruno/Desktop/projetos/conversorCsv/backend/src/files/output/',
            dotfiles: 'deny',
            headers: {
                'x-timestamp': Date.now(),
                'x-sent': true,
                'Content-Type': 'file/csv',
                'Content-Disposition': 'attachment; filename="exemploUnidade.csv"'
            }
        }

        setTimeout(function(){
            res.sendFile('exemploUnidade.csv', options);
        }, 2000);

    },
};

function readFile(filePath) {
    let results = [];

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
            proprietário_rg: getRg(line['propriet_rg']),
            proprietário_cpf: line['propriet_doc/cnpj'],

            inquilino_nome: line['morador_nome'],
            inquilino_telefone: joinTwoDatas(line['morador_fonec'], line['morador_foner']),
            inquilino_celular: line['morador_celular'],
            'inquilino_cpf/cnpj': line['morador_doc'],
            inquilino_rg: getRg(line['morador_rg']),
            inquilino_email: joinTwoDatas(line['morador_mail'], line['morador_mail2']),
        };

        csvOutput.push(lineOutput);
    });

    fs.writeFile('./src/files/output/exemploUnidade.csv', convertToCsv(csvOutput),{enconding:'utf-8',flag: 'w+'}, function (err) {
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

function getRg(rg) {
    // console.log(rg);
    if (!rg) {
        return "";
    }

    return rg = rg.replace("RG:", "").replace(" ", "");
    // .replace(/\./g, "").replace(",", "").replace("-", "") -> Não vai precisar
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
