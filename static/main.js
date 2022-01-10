const ctx = document.getElementById("myChart").getContext("2d");

let delayed

const labels = [
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
];

const data = {
    labels,
    datasets: [{
        data: [214, 315, 248, 319, 198, 249, 297, 365, 277],
        label: "CD Project stock",
        borderColor: "green",
        tension: 0.3,
    },
    ],
};

const config = {
    type: "line",
    data: data,
    options: {
        animation: {
            onComplete: () => {
                delayed = true;
            },
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                    delay = context.dataIndex * 50 + context.datasetIndex * 20;
                }
                return delay;
            },
        },
        radius: 2,
        responsive: true,
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return value + "°C";
                    },
                },
            },
        },
    },

};
console.log(dataFromDB)
let myChart = new Chart(ctx, config)