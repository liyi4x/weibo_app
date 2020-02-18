// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));      

// 初始 option
option = {
    title: {
        text: more_name,
        subtext:'热搜生命周期显示',
        textAlign: 'center',
        left: '50%',
        triggerEvent: true
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        },
        formatter: function(params){    //为什么这里的params变成数组了？？？
            return [
                'No.' + (params[0].data.pos) + '<br>',
                params[0].data.time + '<br>',
                '热度：' + Math.round(params[0].data.desc_extr/10000) + '万<br>'
            ].join('');
            // console.log(params);
        }
    },
    legend: {
        data: ['热度', '排名'],
        top: 10,
        right: '20%'
    },

    dataZoom: [
        {
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'none',
            bottom: 0,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            xAxisIndex: [0],
            filterMode: 'none',
            start: 0,
            end: 100
        }
    ],
    visualMap:[
        {
            type: 'continuous',
            seriesIndex: 0, //第0个series
            dimension: 'desc_extr',
            show: false
        }
    ],
    dataset:{
        dimensions: ['desc', 'desc_extr', 'id', 'pos', 'time'],
        source: []
    },
    xAxis: [
        {
            type: 'time',
            maxInterval: 3600 * 1000
        }
    ],
    yAxis: [
        {
            name: '热度',
            type: 'value',
        },
        {
            name: '排名',
            nameLocation: 'start',
            type: 'value',
            min: 1,
            max: 50,
            // interval: 5,
            inverse: true
        },
    ],
    series: [
        {
            name: '热度',
            type: 'line',
            encode: {
                x: 'time',
                y: 'desc_extr'
            },
            smooth: true,
            showSymbol: false
        },
        {
            name: '排名',
            type: 'line',
            encode: {
                x: 'time',
                y: 'pos',
                // xAxisIndex: 1,
            },
            yAxisIndex: 1,
            // smooth: true,
            showSymbol: false,
            // step: true
        },
    ],
    animationEasing: 'exponentialInOut',
    animationDelayUpdate: function (idx) {
        return idx * 5;
    }
};

myChart.setOption(option);

function showdata(data){
    option.dataset.source = data.data;
    option.visualMap[0].max = Math.max.apply(Math, data.data.map(function(item) {return item.desc_extr}));
    option.visualMap[0].min = Math.min.apply(Math, data.data.map(function(item) {return item.desc_extr}));
    myChart.setOption(option);
}

$.ajax({
    url: 'https://api.liyi.ink/weibo/topdata',
    type: 'GET',
    data: {          
        // 请求参数
        'by': 3,
        'name': more_name
    },
    success: function(data) { // 接口调用成功回调函数
        // console.log(data);
        showdata(data);
    }
});


// setInterval(function(){
//     $.ajax({
//         url: 'https://api.liyi.ink/weibo/topdata',
//         type: 'GET',
//         data: {          
//             // 请求参数
//             'by': 3,
//             'name': more_name
//         },
//         success: function(data) { // 接口调用成功回调函数
//             // data 为服务器返回的数据
//             showdata(data);
//         }
//     });
// }, 10000);


myChart.on('click', function (params) {
    console.log(params);
    if(params.componentType == 'title'){        
        window.open('https://s.weibo.com/weibo?Refer=top_hot&q=' + more_name); 
    }
});
