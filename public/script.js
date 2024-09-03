document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('/api/programAlpha').then(res => res.json()),
        fetch('/api/programBeta').then(res => res.json())
    ]).then(([programAlphaData, programBetaData]) => {
        const totalData = {
            Alice: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Bob: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Charlie: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            David: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Eve: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 },
            Frank: { NCR: 0, DemandIssue: 0, InternalCheckSDR: 0, Completed: 0, Total: 0, Cost: 0 }
        };

        let totalInProgress = 0;
        let totalCompleted = 0;

        const updateTotalData = (sourceData) => {
            Object.keys(sourceData).forEach(engineer => {
                totalData[engineer].NCR += sourceData[engineer].NCR;
                totalData[engineer].DemandIssue += sourceData[engineer].DemandIssue;
                totalData[engineer].InternalCheckSDR += sourceData[engineer].InternalCheckSDR;
                totalData[engineer].Completed += sourceData[engineer].Completed;
                totalData[engineer].Cost += sourceData[engineer].Cost || 0;
                totalData[engineer].Total += sourceData[engineer].Total;

                totalInProgress += sourceData[engineer].NCR + sourceData[engineer].DemandIssue + sourceData[engineer].InternalCheckSDR;
                totalCompleted += sourceData[engineer].Completed;
            });
        };

        updateTotalData(programAlphaData);
        updateTotalData(programBetaData);

        const createTable = (data, tableId) => {
            const table = document.getElementById(tableId);
            Object.keys(data).forEach(engineer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${engineer}</td>
                    <td>${data[engineer].NCR}</td>
                    <td>${data[engineer].DemandIssue}</td>
                    <td>${data[engineer].InternalCheckSDR}</td>
                    <td>${data[engineer].Completed}</td>
                    <td>${data[engineer].Total}</td>
                `;
                table.appendChild(row);
            });
        };

        createTable(programAlphaData, 'programAlpha-table');
        createTable(programBetaData, 'programBeta-table');
        createTable(totalData, 'total-table');

        // Issues Summary (Bar Chart)
        const ctx = document.getElementById('totalChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['NCR', 'Demand Issue', 'Internal Check + SDR', 'Completed'],
                datasets: [
                    {
                        label: 'Alice',
                        data: [totalData.Alice.NCR, totalData.Alice.DemandIssue, totalData.Alice.InternalCheckSDR, totalData.Alice.Completed],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Bob',
                        data: [totalData.Bob.NCR, totalData.Bob.DemandIssue, totalData.Bob.InternalCheckSDR, totalData.Bob.Completed],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Charlie',
                        data: [totalData.Charlie.NCR, totalData.Charlie.DemandIssue, totalData.Charlie.InternalCheckSDR, totalData.Charlie.Completed],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'David',
                        data: [totalData.David.NCR, totalData.David.DemandIssue, totalData.David.InternalCheckSDR, totalData.David.Completed],
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Eve',
                        data: [totalData.Eve.NCR, totalData.Eve.DemandIssue, totalData.Eve.InternalCheckSDR, totalData.Eve.Completed],
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderColor: 'rgba(255, 159, 64, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Frank',
                        data: [totalData.Frank.NCR, totalData.Frank.DemandIssue, totalData.Frank.InternalCheckSDR, totalData.Frank.Completed],
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Project Status Overview (Pie Chart)
        const pieCtx = document.getElementById('pieChart').getContext('2d');
        new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['In Progress', 'Completed'],
                datasets: [{
                    data: [totalInProgress, totalCompleted],
                    backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                layout: {
                    padding: {
                        top: 20,
                        bottom: 20
                    }
                }
            }
        });

        // New line chart for Project Cost
        const costCtx = document.getElementById('costChart').getContext('2d');
        new Chart(costCtx, {
            type: 'line',
            data: {
                labels: ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
                datasets: [{
                    label: 'Project Cost',
                    data: [
                        totalData.Alice.Cost,
                        totalData.Bob.Cost,
                        totalData.Charlie.Cost,
                        totalData.David.Cost,
                        totalData.Eve.Cost,
                        totalData.Frank.Cost
                    ],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
});
