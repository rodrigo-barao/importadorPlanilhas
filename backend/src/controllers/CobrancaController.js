const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');

var results = [];

module.exports = {
    async processarCobrancaAction(req, res) {
        if (!req.files) {
            return res.json("não tem a propriedade length");
        }

        if (req.files.length != 2) {
            return res.json("É necessário enviar dois arquivos, a planilha CSV e o depara.txt");
        }

        let categoryTxt = await readTxtFile(req.files);

        var csvFile = req.files.filter(file => {
            if (file.originalname.includes(".csv")) {
                return file;
            }
        });

        readFile(csvFile[0].path, categoryTxt);

        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        return res.json("Sucesso");
    },

    async testeAction(req, res) {
        console.log("bateu aqui");
        return res.json("Bateu aqui");
    }
};

async function readTxtFile(files) {
    try {
        file = files.filter(file => {
            if (file.originalname.includes(".txt")) {
                return file;
            }
        });

        let categoryTxt = fs.readFileSync(file[0].path, "utf-8");

        return categoryTxt;
    } catch(err) {
        return err;
    }
}

function readFile(filePath, categoryTxt = null) {
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        processarCsv(results, categoryTxt);
    });
}

function processarCsv (results, categoryTxt) {
    var csvOutput = [];

    results.forEach(function (line, key) {
        var lineOutput = {
            vencimento: getDate(line['data1']),
            data_de_competencia: getDateC(line['data1']),
            cobranca_extraordinaria: getType(line['tipo']),
            valor: getValue(line['valor3']),
            unidade: line['apto'],
            bloco: line['bloco'],
            nosso_numero: line['boleto1'],
            complemento: line['acordo'],
            conta_categoria: getCategory(line['especie'], categoryTxt),
        }

        csvOutput.push(lineOutput);
    });

    fs.writeFile('./src/files/output/exemploCobranca.csv', convertToCsv(csvOutput),{enconding:'utf-8',flag: 'a'}, function (err) {
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

function getCategory(data, categoryTxt) {
    if (!data) {
        return '';
    }

    categoryTxt = categoryTreatment(categoryTxt);
    defaultCategory = '1.9';

    categoryTxt.forEach(category => {
        if (category[0] == data) {
            defaultCategory = (category[1]);
        }
    });

    return defaultCategory;
}

function getValue(data) {
    if (!data) {
        return '';
    }

    return data.replace(',' , '.');
}

function getType(data) {
    if (!data) {
        return '';
    }

    if (data == 'P') {
        return 1;
    }

    return 0;
}

function getDateC(data) {
    if (!data)
        return '';

    return moment(data, 'DD-MMM-YY').subtract(1, 'months').format('DD/MM/YYYY');
}

function getDate(data) {
    if (!data)
        return '';

    return moment(data, 'DD-MMM-YY').format('DD/MM/YYYY');
}

function categoryTreatment(categoryTxt) {
    firstSplit = categoryTxt.split("\n");
    categoryArray = [];

    firstSplit.forEach(async category => {
        await categoryArray.push(category.split("="));
    })

    return categoryArray;
}
