$(function(){

    function apexChartFirst() {
        let options = {
            chart: {
                height: 80,
                type: 'bar',
                toolbar: {
                    show: false
                },
            },
            series: [{
                data: [70, 63, 84, 79, 70, 65, 80, 70, 68, 86, 81, 88, 60]
            }],
            colors: ['RGBA(255, 173, 1, 0.3)'],
            plotOptions: {
                bar: {
                    columnWidth: "45%",
                    distributed: true,
                    endingShape: "rounded",
                    startingShape: "rounded",
                },
            },
            grid: {
                padding: {
                    left: -20,
                    right: 0,
                },
                margin: {
                    bottom: 0
                },
                xaxis: {
                    lines: {
                        show: false,
                    }
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
            }
        };

        let chart = new ApexCharts(document.querySelector("#first-apex-chart"), options);
        chart.render();
    };

    function apexChartSecond() {
        let options = {
            series: [{
                data: [210, 220, 220, 280, 260, 210, 230, 300, 280, 260, 210, 230, 300]
            }],
            chart: {
                width: '100%',
                toolbar: {
                    show: false
                },
                height: 80,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    columnWidth: "40%",
                    distributed: true,
                    endingShape: "rounded",
                    startingShape: "rounded",
                },
            },
            grid: {
                padding: {
                    left: -20,
                    right: 0
                },
                xaxis: {
                    lines: {
                        show: false,
                    }
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                }
            },
            colors: ['RGBA(246, 121, 93, 0.3)'],

            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
            }
        };

        let chart = new ApexCharts(document.querySelector("#second-apex-chart"), options);
        chart.render();
    };

    function apexChartThird() {
        let options = {
            series: [{
                data: [31, 40, 28, 51, 42, 25, 63]
            }],
            chart: {
                width: '100%',
                toolbar: {
                    show: false
                },
                height: 80,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                padding: {
                    left: -20,
                    right: 0
                },
                xaxis: {
                    lines: {
                        show: false,
                    }
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                }
            },
            colors: [Sing.colors['brand-danger']],

            stroke: {
                colors: [Sing.colors['brand-danger']],
                curve: 'smooth'
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
            }
        };

        let chart = new ApexCharts(document.querySelector("#third-apex-chard"), options);
        chart.render();
    };

    function apexChartFourth() {
        let options = {
            series: [{
                data: [56, 32, 45, 32, 34, 52, 65]
            }],
            chart: {
                width: '100%',
                toolbar: {
                    show: false
                },
                height: 80,
                type: 'area'
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                padding: {
                    left: -20,
                    right: 0
                },
                xaxis: {
                    lines: {
                        show: false,
                    }
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                }
            },
            colors: [Sing.colors['brand-warning']],
            stroke: {
                colors: [Sing.colors['brand-warning']],
                curve: 'smooth'
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
            }
        };

        let chart = new ApexCharts(document.querySelector("#fourth-apex-chart"), options);
        chart.render();
    };

    function apexChartFifth() {
        let options = {
            series: [{
                name: 'Income',
                type: 'area',
                data: [31, 40, 28, 51, 42, 109, 100]
            }, {
                name: 'Outcome',
                type: 'line',
                data: [86, 96, 84, 62, 44, 52, 41]
            }],
            chart: {
                toolbar: {
                    show: false
                },
                height: 300,
            },
            grid: {
                padding: {
                    right: 20,
                    left: -20
                },
                xaxis: {
                    lines: {
                        show: false,
                    }
                }
            },
            colors: [Sing.colors['brand-warning'], Sing.colors['black']],
            fill: {
                colors: [ '#fff5e0' ]
            },
            stroke: {
                width: [4, 4],
                opacity: 0.5,
                colors: [Sing.colors['brand-warning'], Sing.colors['black']],
                curve: 'smooth'
            },

            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
            ],
            legend: {
                position: 'top',
                horizontalAlign: 'center',
                markers: {
                    fillColors :[Sing.colors['brand-warning'], Sing.colors['black']]
                }
            },
            yaxis: {
                labels: {
                    show: true,
                    style: {
                        colors: ['#898280','#898280','#898280','#898280','#898280'],
                        fontSize: '12px',
                    },
                    offsetX: -20,
                    offsetY: 0,
                },
                tickAmount: 4,
                padding: {
                    left: -20
                },
            },
            xaxis: {
                labels: {
                    style: {
                        colors: ['#898280','#898280','#898280','#898280','#898280','#898280','#898280'],
                        fontSize: '12px',
                    }
                }
            }
        };

        let chart = new ApexCharts(document.querySelector("#fifth-apex-chart"), options);
        chart.render();
    };

    function apexChartSixth() {
        let options = {
            series: [1732, 253, 154],
            chart: {
                type: 'donut',
                height: 180,
                width: '100%'
            },
            colors: [Sing.colors['brand-warning'], Sing.colors['brand-danger'], Sing.colors['black']],
            fill: {
                colors: [Sing.colors['brand-warning'], Sing.colors['brand-danger'], Sing.colors['black']]
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '50%',
                    },
                }
            },
            stroke: {
                width: 0
            },
            legend: {
                show: false
            }
        };

        let chart = new ApexCharts(document.querySelector("#sixth-apex-chard"), options);
        chart.render();
    };

    function pageLoad(){
        $('.widget').widgster();
        apexChartFirst();
        apexChartSecond();
        apexChartThird();
        apexChartFourth();
        apexChartFifth();
        apexChartSixth();
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
});
