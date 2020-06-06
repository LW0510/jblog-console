<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { listArticle } from "@/api/blog/article";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // chartData: {
    //   type: Object,
    //   required: true
    // }
  },
  data() {
    return {
      chart: null,
        xValue:[],
        yValue : [],
        data:[]
    }
  },
  watch: {
    // chartData: {
    //   deep: true,
    //   handler(val) {
    //     this.setOptions(val)
    //   }
    // }
  },
    created() {
        this.listArticle();
    },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
      listArticle(){
          this.loading = true;
          let query = {
            pageNum: 1,
            pageSize:10,
            orderField:'view_num',
            order:'desc',
            status:'1'
          }
          listArticle(query).then(response => {
              response.rows.sort(function (a,b) {
                  return a.viewNum-b.viewNum;
              });
              for (var i = 0;i<response.rows.length;i++){
                  this.xValue.push(response.rows[i].viewNum);
                  this.yValue.push(response.rows[i].title);
                  this.data[i] =[response.rows[i].title,response.rows[i].viewNum];
              }
              this.initChart(this.xValue,this.yValue,this.data);
          });
          this.loading = false;
      },

    initChart(xValue,yValue,data) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(data)
    },
    setOptions(data) {
        const set = [
            ['店铺', '销量'],
            ['Top10', 427],
            ['Top9', 433],
            ['Top8', 437],
            ['Top7', 455],
            ['Top6', 461],
            ['Top5', 463],
            ['Top4', 468],
            ['Top3', 468],
            ['Top2', 483],
            ['Top1', 500]
        ];

        this.chart.setOption({
          dataset:{
              source:data
          },
            title: {
                text: '最热文章Top10 (浏览量)',
                left:'center'
            },
          grid:{
              left:200,
              right:24,
              top:40,
              bottom:40
          },
          // dataZoom:{
          //     type:'slider',
          //     yAxisIndex:0,
          //     left:4,
          //     width:16
          // },
          xAxis: {
              type:'value'
          },
          yAxis: {
              type:'category',
          },
          series: [{
              type: 'bar',
              barWidth:'80%',
              itemStyle: {
                  normal: {
                      label: {
                          show: true,		//开启显示
                          position: 'right',	//在上方显示
                          textStyle: {	    //数值样式
                              color: 'black',
                              fontSize: 12
                          }
                      }
                  }
              }
          }]
      })
    }
  }
}
</script>
