const express = require('express');
const XLSX = require('xlsx');
const chokidar = require('chokidar');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

let programAlphaData = [];
let programBetaData = [];

const excelFilePath = path.join(__dirname, 'excel/data.xlsx');

const loadExcelData = () => {
    const workbook = XLSX.readFile(excelFilePath);

    const programAlphaSheet = workbook.Sheets['Program Alpha'];
    const programBetaSheet = workbook.Sheets['Program Beta'];

    const processSheet = (sheet) => {
        const data = XLSX.utils.sheet_to_json(sheet);
    
        const result = {
            Alice: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Bob: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Charlie: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            David: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Eve: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Frank: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 }
        };
    
        data.forEach(row => {
            const engineer = (row['Backline Assigned'] || '').trim().toLowerCase();
            const status = (row['backline status'] || '').trim().toLowerCase();
            const issueSource = (row['issue source'] || '').trim().toLowerCase();
            const cost = row['Cost'] || 0; // Extract the cost from the row
    
            const engineerName = engineer.charAt(0).toUpperCase() + engineer.slice(1);
    
            if (result[engineerName]) {
                if (status === 'completed') {
                    result[engineerName].Completed += 1;
                } else if (status === 'in progress') {
                    if (issueSource === 'ncr') {
                        result[engineerName].NCR += 1;
                    } else if (issueSource === 'demand issue') {
                        result[engineerName].DemandIssue += 1;
                    } else if (issueSource === 'internal check' || issueSource === 'sdr') {
                        result[engineerName].InternalCheckSDR += 1;
                    }
                }
                result[engineerName].Cost += cost; // Sum up the cost for each engineer
                result[engineerName].Total = result[engineerName].NCR + result[engineerName].DemandIssue + result[engineerName].InternalCheckSDR + result[engineerName].Completed;
            }
        });
    
        return result;
    };
    
    programAlphaData = processSheet(programAlphaSheet);
    programBetaData = processSheet(programBetaSheet);

    console.log("Program Alpha Data:", programAlphaData);
    console.log("Program Beta Data:", programBetaData);
};

loadExcelData();

chokidar.watch(excelFilePath).on('change', () => {
    console.log('Excel file changed. Reloading data...');
    loadExcelData();
});

app.use(express.static('public'));

app.get('/api/programAlpha', (req, res) => {
    res.json(programAlphaData);
});

app.get('/api/programBeta', (req, res) => {
    res.json(programBetaData);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
