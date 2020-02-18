// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));      

// 初始 option
option = {
    title: {
        text: '微博热搜榜实时显示',
        subtext:'每分钟更新',
        // textAlign: 'center',
        // left: '50%'
    },
    tooltip: {
        show: true,
        trigger: 'item',
        axisPointer: {
            type: 'none',
            label: {
                show: true,
                backgroundColor: '#283b56'
            }
        },
        formatter: function(params){
            return [
                'No.' + (params.data.pos) + '<br>',
                params.data.desc + '<br>',
                '热度：' + Math.round(params.data.desc_extr/10000) + '万<br>'
            ].join('');
            // console.log(params);
        }
    },
    grid:{
        left: '30%',
        // containLabel: true
    },
    visualMap:[
        {
            type: 'continuous',
            seriesIndex: 0, //第0个series
            dimension: 'desc_extr',
            // text: ['hot', 'cool'],
            show: false
        }
    ],
    // dataZoom: [
    //     {
    //         id: 'dataZoomY',
    //         type: 'inside',
    //         yAxisIndex: [0],
    //         filterMode: 'filter',
    //         start: 0,
    //         end: 70
    //     }
    // ],
    dataset:{
        dimensions: ['desc', 'desc_extr', 'id', 'pos', 'time'],
        source: []
    },
    xAxis: {
        type: 'value',
        name: '实时热度',
        nameLocation: 'center',
        nameTextStyle: {
            fontSize: 20,
            lineHeight: 50
        },
        position: 'top'
    },
    yAxis: {
        type: 'category',
        inverse: true,
        triggerEvent: true
    },
    series: [
        {
            name: 'top50',
            type: 'bar',
            label:{
                normal:{
                    show: true,
                    color:'#000',
                    position: 'right'
                }
            },
            encode: {
                x: 'desc_extr',
                y: 'desc'
            }
        }
    ],
    animationEasing: 'exponentialInOut',
    animationDelayUpdate: function (idx) {
        return idx * 5;
    }
};

myChart.setOption(option);

function showdata(data){
    option.dataset.source = data.data;
    option.visualMap[0].max = data.data[0].desc_extr;
    option.visualMap[0].min = data.data[49].desc_extr;
    option.xAxis.name = data.data[0].time.substr(0,16) + ' 热度'

    myChart.setOption(option);
}

$.ajax({
    url: 'https://api.liyi.ink/weibo/topdata',
    type: 'GET',
    data: {
        'by': 1,
    },
    success: function(data) { // 接口调用成功回调函数
        showdata(data);
    }
});

setInterval(function(){
    $.ajax({
        url: 'https://api.liyi.ink/weibo/topdata',
        type: 'GET',
        data: {
            'by': 1
        },
        success: function(data) { // 接口调用成功回调函数
            showdata(data);
        }
    });
}, 10000);

myChart.on('click', function (params) {
    // console.log(params);
    if(params.componentType == 'yAxis'){
        window.open('https://s.weibo.com/weibo?Refer=top_hot&q=' + params.value); 
    }
    else if(params.componentType == 'series'){
        window.open('./more?name=' + params.name);
    }
});
