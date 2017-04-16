$(function () {
    $.get('/myscore', function(data) {
        $('#myscore').highcharts({
            title: {
                text: 'My Score',
                x: -20
            },
            xAxis: {
                categories: data.categories,
            },
            yAxis: {
                title: {
                    text: 'score'
                },
                tickPositions: [0, 50, 100],
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            credits: {
                    enabled:false
            },
            colors: ['#0D47A1', '#50B432', '#ED561B', '#DDDF00'],
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: [{
                name: 'Score',
                data: data.score
            }]
        });
    });
    $.get('/myrank', function(data) {
        $('#myrank').highcharts({
            title: {
                text: 'My Rank',
                x: -20
            },
            xAxis: {
                categories: data.categories,
            },
            yAxis: {
                title: {
                    text: 'Class Rank'
                },
                tickPositions: [150, 120, 90, 60, 30, 1],
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            credits: {
                    enabled:false
            },
            colors: ['#EF6C00', '#50B432', '#ED561B', '#DDDF00'],
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: [{
                name: 'class rank',
                data: data.rank
            }]
        });
    });
});
