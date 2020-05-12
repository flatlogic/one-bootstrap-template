$(function() {

    function initFlot() {
        var data1 = [
                [1, 20],
                [2, 20],
                [3, 40],
                [4, 30],
                [5, 40],
                [6, 35],
                [7, 47]
            ],
            data2 = [
                [1, 13],
                [2, 8],
                [3, 17],
                [4, 10],
                [5, 17],
                [6, 15],
                [7, 16]
            ],
            data3 = [
                [1, 23],
                [2, 13],
                [3, 33],
                [4, 16],
                [5, 32],
                [6, 28],
                [7, 31]
            ],
            $chart = $("#flot-main"),
            $tooltip = $('#flot-main-tooltip');

        function _initChart(){
            var plot = $.plotAnimator($chart, [{
                label: "Traffic",
                data: data3,
                lines: {
                    fill: 1,
                    lineWidth: 0
                },
                color: Sing.colors['brand-primary']
            },{
                label: "Traffic",
                data: data2,
                lines: {
                    fill: 1,
                    lineWidth: 0
                },
                color:[Sing.colors['brand-danger']]
            },{
                label: "Traffic",
                data: data1,
                animator: {steps: 60, duration: 1000, start:0},
                lines: {
                    lineWidth: 2
                },
                shadowSize:0,
                color: Sing.colors['brand-primary']
            }],{
                xaxis: {
                    tickLength: 0,
                    tickDecimals: 0,
                    min:2,
                    font :{
                        lineHeight: 13,
                        color: Sing.colors['gray-500']
                    }
                },
                yaxis: {
                    tickDecimals: 0,
                    font :{
                        lineHeight: 13,
                        color: Sing.colors['gray-500']
                    }
                },
                grid: {
                    backgroundColor: "transparent",
                    borderWidth:1,
                    borderColor: "transparent",
                    margin:0,
                    minBorderMargin:0,
                    labelMargin:20,
                    hoverable: true,
                    clickable: true,
                    mouseActiveRadius:6
                },
                legend: false
            });

            $chart.on("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    $tooltip.html(item.series.label + " at " + x + ": " + y)
                        .css({
                            top: item.pageY + 5 - window.scrollY,
                            left: item.pageX + 5 - window.scrollX
                        })
                        .fadeIn(200);
                } else {
                    $tooltip.hide();
                }
            });
        }

        _initChart();

        SingApp.onResize(_initChart);
    }

    function initEasyPie() {
        $('#easy-pie1').easyPieChart({
            barColor: Sing.colors['brand-primary'],
            trackColor: Sing.colors['brand-danger'],
            scaleColor: false,
            lineWidth: 8,
            size: 140
        });
    }

    function initSparkline2() {
        $('#sparkline2').sparkline([1,4,5],{
            type: 'pie',
            width: '100px',
            height: '100px',
            highlightLighten: 1.05,
            sliceColors: [
                Sing.colors['brand-danger'],
                Sing.colors['brand-success'],
                Sing.colors['brand-primary'],
            ]
        });
    }

    function initSparkline3() {
        $('#sparkline3').sparkline([1,2,4,2,3,7], {
            width: '100%',
            height: '100px',
            lineColor: Sing.colors['brand-danger'],
            fillColor: false,
            highlightLineColor: Sing.palette['brand-success-light'],
            spotColor: Sing.palette['brand-success-light'],
            minSpotColor: Sing.colors['brand-warning'],
            maxSpotColor: Sing.colors['brand-warning'],
            spotRadius: 2,
            lineWidth: 2
        });
    }

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
            markers: {
                colors:[Sing.colors['brand-warning'], Sing.colors['black']]
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
            fill: {
                colors: [ '#fff5e0' ]
            },
            colors: [Sing.colors['brand-warning'], Sing.colors['black']],
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

        var chart = new ApexCharts(document.querySelector("#apex-chart"), options);
        chart.render();
    };

    function initNvd32() {
        nv.addGraph(function() {
            var chart = nv.models.multiBarChart()
                .margin({left: 28, bottom: 30, right: 0})
                .color([Sing.colors['brand-primary'], Sing.colors['brand-danger']]);

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

            chart.yAxis
                .showMaxMin(false)
                .tickFormat(d3.format(',f'));

            d3.select('#nvd32 svg')
                .style('height', '300px')
                .datum(testData(['Uploads', 'Downloads'], 10).map(function(el, i){
                    el.area = true;
                    return el;
                }))
                .transition().duration(500)
                .call(chart);

            SingApp.onResize(chart.update);

            return chart;
        });
    }

    function initRickshaw() {
        "use strict";

        var seriesData = [ [], [] ];
        var random = new Rickshaw.Fixtures.RandomData(30);

        for (var i = 0; i < 30; i++) {
            random.addData(seriesData);
        }

        var graph = new Rickshaw.Graph( {
            element: document.getElementById("rickshaw"),
            height: 100,
            renderer: 'stack',
            series: [
                {
                    color: Sing.colors['brand-success'],
                    data: seriesData[0],
                    name: 'Uploads'
                }, {
                    color: Sing.colors['brand-primary'],
                    data: seriesData[1],
                    name: 'Downloads'
                }
            ]
        } );

        function onResize(){
            var $chart = $('#rickshaw');
            graph.configure({
                width: $chart.width(),
                height: 100
            });
            graph.render();

            $chart.find('svg').css({height: '100px'});
        }

        SingApp.onResize(onResize);
        onResize();


        var hoverDetail = new Rickshaw.Graph.HoverDetail( {
            graph: graph,
            xFormatter: function(x) {
                return new Date(x * 1000).toString();
            }
        } );

        let intervalId = setInterval( function() {
            random.removeData(seriesData);
            random.addData(seriesData);
            graph.update();

        }, 1000 );

        $(document).on('pjax:start', () => {
            clearInterval(intervalId);
        });
    }

    function initMorris1() {
        $('#morris1').css({height: '343px'}); //safari svg height fix
        Morris.Line({
            element: 'morris1',
            resize: true,
            data: [
                { y: '2006', a: 100, b: 90 },
                { y: '2007', a: 75,  b: 65 },
                { y: '2008', a: 50,  b: 40 },
                { y: '2009', a: 75,  b: 65 },
                { y: '2010', a: 50,  b: 40 },
                { y: '2011', a: 75,  b: 65 },
                { y: '2012', a: 100, b: 90 }
            ],
            xkey: 'y',
            ykeys: ['a', 'b'],
            labels: ['Series A', 'Series B'],
            lineColors: [Sing.colors['brand-primary'], Sing.colors['brand-danger']],
            pointSize: 0
        });
    }

    function initSparkline1() {
        function _initChart() {
            $('#sparkline1').sparkline([2,4,6,2,7,5,3,7,8,3,6],{
                width: '100%',
                fillColor: Sing.colors['brand-primary'],
                height: '100px',
                lineColor: 'transparent',
                spotColor: Sing.palette[7],
                minSpotColor: null,
                maxSpotColor: null,
                highlightSpotColor: Sing.colors['brand-success'],
                highlightLineColor: Sing.colors['brand-primary'],
            }).sparkline([5,3,7,8,3,6,2,4,6,2,7],{
                composite: true,
                lineColor: 'transparent',
                spotColor: Sing.palette['brand-primary-light'],
                fillColor: Sing.colors['brand-success'],
                minSpotColor: null,
                maxSpotColor: null,
                highlightSpotColor: Sing.palette['brand-primary-light'],
                highlightLineColor: Sing.palette['brand-primary-light'],
            })
        }

        _initChart();

        SingApp.onResize(_initChart);
    }

    function initFlotBar() {
        var bar_customised_1 = [[1388534400000, 120], [1391212800000, 70],  [1393632000000, 100], [1396310400000, 60], [1398902400000, 35]];
        var bar_customised_2 = [[1388534400000, 90], [1391212800000, 60], [1393632000000, 30], [1396310400000, 73], [1398902400000, 30]];
        var bar_customised_3 = [[1388534400000, 80], [1391212800000, 40], [1393632000000, 47], [1396310400000, 22], [1398902400000, 24]];

        var data = [
            {
                label: "Apple",
                data: bar_customised_1,
                bars: {
                    show: true,
                    barWidth: 12*24*60*60*300,
                    fill: true,
                    lineWidth:0,
                    order: 1
                }
            },
            {
                label: "Google",
                data: bar_customised_2,
                bars: {
                    show: true,
                    barWidth: 12*24*60*60*300,
                    fill: true,
                    lineWidth: 0,
                    order: 2
                }
            },
            {
                label: "Facebook",
                data: bar_customised_3,
                bars: {
                    show: true,
                    barWidth: 12*24*60*60*300,
                    fill: true,
                    lineWidth: 0,
                    order: 3
                }
            }

        ];

        function _initChart() {
            $.plot($("#flot-bar"), data, {
                series: {
                    bars: {
                        show: true,
                        barWidth: 12*24*60*60*350,
                        lineWidth: 0,
                        order: 1,
                        fillColor: {
                            colors: [{
                                opacity: 1
                            }, {
                                opacity: 1
                            }]
                        }
                    }
                },
                xaxis: {
                    mode: "time",
                    min: 1387497600000,
                    max: 1400112000000,
                    tickLength: 0,
                    tickSize: [1, "month"],
                    axisLabel: 'Month',
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 13,
                    axisLabelPadding: 15,
                    font :{
                        lineHeight: 13,
                        color: Sing.colors['gray-500']
                    }
                },
                yaxis: {
                    axisLabel: 'Value',
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 13,
                    axisLabelPadding: 5,
                    font :{
                        lineHeight: 13,
                        color: Sing.colors['gray-500']
                    }
                },
                grid: {
                    hoverable: true,
                    borderWidth: 0
                },
                legend: {
                    backgroundColor: "transparent",
                    labelBoxBorderColor: "none"
                },
                colors: [
                    Sing.colors['brand-danger'],
                    Sing.colors['brand-primary'],
                    Sing.colors['brand-success']
                ]
            });
        }

        _initChart();

        SingApp.onResize(_initChart);
    }

    function initMorris3() {
        $('#morris3').css({height: 180});
        Morris.Donut({
            element: 'morris3',
            backgroundColor: 'none',
            resize: true,
            data: [
                {label: "In-Store Sales", value: 30},
                {label: "Mail-Order Sales", value: 20}
            ],
            colors: [Sing.colors['brand-danger'], Sing.colors['brand-primary']],
        });
    }

    function pageLoad() {
        $('.widget').widgster();
        $('.sparkline').each(function(){
            $(this).sparkline('html', $(this).data());
        });

        initFlot();
        initRickshaw();
        initSparkline1();
        initSparkline2();
        initSparkline3();
        apexChartFifth();
        initNvd32();
        initMorris1();
        initMorris3();
        initEasyPie();
        initFlotBar();
    }

    pageLoad();
    SingApp.onPageLoad(pageLoad);
});

/* Inspired by Lee Byron's test data generator. */
function _stream_layers(n, m, o) {
    if (arguments.length < 3) o = 0;
    function bump(a) {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - .5,
            z = 10 / (.1 + Math.random());
        for (var i = 0; i < m; i++) {
            var w = (i / m - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }
    return d3.range(n).map(function() {
        var a = [], i;
        for (i = 0; i < m; i++) a[i] = o + o * Math.random();
        for (i = 0; i < 5; i++) bump(a);
        return a.map(function(d, i) {
            return {x: i, y: Math.max(0, d)};
        });
    });
}

function testData(stream_names, pointsCount) {
    var now = new Date().getTime(),
        day = 1000 * 60 * 60 * 24, //milliseconds
        daysAgoCount = 60,
        daysAgo = daysAgoCount * day,
        daysAgoDate = now - daysAgo,
        pointsCount = pointsCount || 45, //less for better performance
        daysPerPoint = daysAgoCount / pointsCount;
    return _stream_layers(stream_names.length, pointsCount, .1).map(function(data, i) {
        return {
            key: stream_names[i],
            values: data.map(function(d,j){
                return {
                    x: daysAgoDate + d.x * day * daysPerPoint,
                    y: Math.floor(d.y * 100) //just a coefficient,
                }
            })
        };
    });
}