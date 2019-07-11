const csv = require('csv-parser');
const fs = require('fs');
const moment = require('moment');

var results = [];

module.exports = {
    async sendCharges(req, res) {
        if (!req.files) {
            return res.status(500).json("Nenhum arquivo enviado");
        }

        if (req.files.length != 2) {
            return res.status(500).send("É necessário enviar dois arquivos, a planilha CSV e o depara.txt");
        }

        let categoryTxt = await readTxtFile(req.files);

        var csvFile = await req.files.filter(file => {
            if (file.originalname.includes(".csv")) {
                return file;
            }
        });

        await readFile(csvFile[0].path, categoryTxt);
        // let fileName = await readFile(csvFile[0].path, categoryTxt);

        req.files.forEach(file => {
            fs.unlinkSync(file.path);
        });

        // console.log("out of scope -> " + fileName);

        // res.download('./src/files/output/exemploCobranca.csv', String(fileName) + '.csv', (err) => {
        return res.download('./src/files/output/exemploCobranca.csv');
        // await res.download('./src/files/output/exemploCobranca.csv', 'cobrancas.csv', (err) => {
        //     if (err) {
        //         return res.json(err);
        //     } else {
        //         return res.json("Sucesso");
        //     }
        // });

        // return res.json("Sucesso");
    },
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

async function readFile(filePath, categoryTxt = null) {
    return await fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', async (data) => await results.push(data))
    .on('end', async () => {
        return await processarCsv(results, categoryTxt);
    });
}

async function processarCsv (results, categoryTxt) {
    var csvOutput = [];
    let fileName;

    for (let i = 0; i < results.length; i++) {
        if (!fileName) {
            fileName = await getFileName(results[i]['nome']);
        }

        var lineOutput = {
            vencimento: getDate(results[i]['data1']),
            data_de_competencia: getDateC(results[i]['data1']),
            cobranca_extraordinaria: getType(results[i]['tipo']),
            valor: getValue(results[i]['valor3']),
            unidade: results[i]['apto'],
            bloco: results[i]['bloco'],
            nosso_numero: results[i]['boleto1'],
            complemento: results[i]['acordo'],
            conta_categoria: getCategory(results[i]['especie'], categoryTxt),
        };

        csvOutput.push(lineOutput);
    }

    fs.writeFile('./src/files/output/exemploCobranca.csv', convertToCsv(csvOutput),{enconding:'utf-8',flag: 'a'}, function (err) {
        if (err) throw err;
        console.log('Arquivo salvo!');
    });

    return fileName;
}

async function getFileName(field) {
    return field = field.replace(/ /g, "").replace(/\./g, "");
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
    defaultCategory = '1.1';

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
