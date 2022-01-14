import { Component, OnInit } from "@angular/core";
import { abstractAnalysis } from "../abstractAnalysisPage";
import * as d3 from 'd3';

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ['../../analysis-style.less'],
})

export class AnalysisComponent extends abstractAnalysis implements OnInit  {

  private _isDataAnalysised: boolean = false;
  private _analysisedData: any;

  private margin = 50;  private margina = {top: 10, right: 30, bottom: 30, left: 40};
  private width = 800 - (this.margin * 2);
  private height = 480 - (this.margin * 2);
  
  ngOnInit(): void {}
 
  /**
  * @description show pop up when the analysis name is on click
  */
  showPop(analName:string){
    if(document.getElementById(analName).style.display=='inline'){
      document.getElementById(analName).style.display='none'
      document.getElementById(analName+"-head").style.background='none';
      document.getElementById(analName+"-head").style.color='black';
    }
    else{
      document.getElementById(analName).style.display='inline';
      document.getElementById(analName+"-head").style.background='lightskyblue';
      document.getElementById(analName+"-head").style.color='white';
    }
  }

  /**
   * @description run Analysis
   */

  async runAnalysis(activity:string): Promise<void>{

    // Check the options
    if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');
    if(!this.isSelectedPreprocessed) return alert('선택하신 문서는 전처리되지 않은 문서입니다. 전처리를 먼저 해주세요!');
    let optionValue1 =  (<HTMLInputElement> document.getElementById(activity+'_option1'))!= null? (<HTMLInputElement> document.getElementById(activity+'_option1')).value:null;
    let optionValue2 =  (<HTMLInputElement> document.getElementById(activity+'_option2')) != null? (<HTMLInputElement> document.getElementById(activity+'_option2')).value:null;
    let optionValue3 =  (<HTMLInputElement> document.getElementById(activity+'_option3')) != null? (<HTMLInputElement> document.getElementById(activity+'_option2')).value:null;

    this.LoadingWithMask();
    document.getElementById("cancelbtn").addEventListener("click", this.closeLoadingWithMask);

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      'option1': optionValue1,
      'option2': optionValue2,
      'option3': optionValue3,
      'analysisName': activity,
    });
    
    this.clearResult();

    // Send Requests to Flask
    let res = await this.middlewareService.postDataToMiddleware('/textmining',data);
    
    if(res==null){
      this.isDataAnalysised = false;
      alert("내부적인 오류가 발생했습니다. 잠시후 다시 시도해주세요");
      this.closeLoadingWithMask();
      return ;
    }

    if(res.returnCode!=200){
      alert(res.errMsg);
      this.closeLoadingWithMask();
      return ;
    };
    
    this.analysisedData = res.result_graph;
    this.isDataAnalysised = true;
    this.isDataPreview =false;
    // let temp=[];
    // // let i=0;
    // for (let i=0;i< Object.keys(this.analysisedData).length;i++){
    //   temp.push({word:Object.keys(this.analysisedData)[i], count:this.analysisedData[Object.keys(this.analysisedData)[i]]});
    // }


    if(activity=='count'|| activity=='tfidf'){
      this.drawTable(activity, JSON.stringify(this.analysisedData));
      this.drawBarChart(JSON.stringify(this.analysisedData));
    }
    else if(activity=='network' || activity=='ngrams')
      this.drawNetworkChart(JSON.stringify(this.analysisedData));
    else if(activity=='kmeans' || activity=='word2vec')
      this.drawScatterChart(JSON.stringify(this.analysisedData));
    else if(activity=='hcluster')
      this.drawTreeChart(JSON.stringify(this.analysisedData));

    alert("분석 완료되었습니다.");
    this.closeLoadingWithMask();
  }

  /**
   * @description draw a result table for analysis using d3
   */

  drawTable(analType:string, data_str:string){
    let data:Array<{word:string,value:number}> = JSON.parse(data_str);

    const table = d3.select("figure#table")
      .attr('class','result-pretable')
      .append("table")
      .attr('width','100%')
      .attr('height','200px')

    if(analType=='count'||analType=='tfidf'){
      const th = table.append("tr")
      .style('padding','15px 0px')
      .style('font-weight','500')
      .style('text-align','center');
      
      th.append('th').text('No');
      th.append('th').text('단어');
      th.append('th').text('값');

      const tbody = table.append("tbody")
      .style('text-align','center');

      for(let i=0;i<data.length;i++){
        const tr = tbody.append("tr");
        tr.append("td").text(i+1);
        tr.append("td").text(data[i]['word']);
        tr.append("td").text(data[i]['value']);
      }
    }
  }

  /**
   * @description draw a bar chart using the data using d3
   */
  
  drawBarChart(data_str:string){
    let data:Array<{word:string,value:number}> = JSON.parse(data_str);

    // console.log(data);
    // let data=[
    //   {word:"북한",count:10},
    //   {word:"통일",count:9},
    //   {word:"문재인",count:9},
    //   {word:"박근혜",count:8}
    // ];
    
    let svg = d3.select("figure#bar")
    .append("svg")
    .attr("width", this.width + (this.margin * 2))
    .attr("height", this.height + (this.margin * 2))
    .append("g")
    .attr("transform", "translate(" + this.margin + "," + this.margin + ")");
  
    // Create the X-axis band scale
    const x = d3.scaleBand()
    .range([0, this.width])
    .domain(data.map(d => d.word))
    .padding(0.2);

    // Draw the X-axis on the DOM
    svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([this.height, 0]);

    // Draw the Y-axis on the DOM
    svg.append("g")
    .call(d3.axisLeft(y));

    // Create and fill the bars
    svg.selectAll("bars")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d.word))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => this.height - y(d.value))
    .attr("fill", "red")
      .on("mouseover",function(e,d){
        tooltip
            .html("Word: " + d['word'] + "<br>" + "Value: " + d['value'])
            .style("opacity", 1)
        d3.select(this).attr("fill","blue")
      })
      .on("mousemove", function(e, d) {
        tooltip
        .style("left", (e['pageX']+20) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (e['pageY']) + "px")
      })
    .on("mouseout",function(){
      d3.select(this).attr("fill","red");
      tooltip.style("opacity", 0);
  });

    let tooltip = d3.select("figure#bar")
    .append("div")
    .style("opacity", 0)
    // .attr("class", "tooltip")
    .style("position","absolute")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

    // // Animation
    // svg.selectAll("rect")
    // .transition()
    // .duration(800)
    // .attr("y", function(d) { return y(d.value); })
    // // .attr("height", function(d) { return height - y(d.value); })
    // .delay(function(d,i){console.log(i) ; return(i*100)});
 
  }

  /**
   * @description draw a network chart using the data using d3
   */

  drawNetworkChart(data_str:string){
    let data:any = JSON.parse(data_str);
    // console.log(data);
    const margin = {top: 10, right: 30, bottom: 30, left: 40};
    
    // append the svg object to the body of the page
    const svg = d3.select("figure#network")
    .append("svg")
      .attr("width", this.width + margin['left'] + margin['right'])
      .attr("height", this.height + margin['top'] + margin['bottom'])
    .append("g")
      .attr("transform",
            `translate(${margin['left']}, ${margin['top']})`);

    // Initialize the links
    const link = svg
      .selectAll("line")
      .data(data['links'])
      .join("line")
        .style("stroke", "#aaa")

    // Initialize the nodes
    const node = svg
      .selectAll("circle")
      .data(data['nodes'])
      .join("circle")
        .attr("r", 10)
        .style("fill", "#69b3a2")

    const g = d3.select("svg").select('g');
        g.append("text")
      .data(data['nodes'])
          .attr("dx", function(d){return -20})
          .text(function(d){return d['name']})

    // Let's list the force we wanna apply on the network
    const simulation = d3.forceSimulation(data['nodes'])                 // Force algorithm is applied to data.nodes
        .force("link", d3.forceLink()                               // This force provides links between nodes
              .id(function(d) { return d['id']; })                     // This provide  the id of a node
              .links(data['links'])                                    // and this the list of links
        )
        .force("charge", d3.forceManyBody().strength(-400))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
        .force("center", d3.forceCenter(this.width /2, this.height / 2))     // This force attracts nodes to the center of the svg area
        .on("end", ticked);

    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked() {
      link
          .attr("x1", function(d) { return d['source']['x']; })
          .attr("y1", function(d) { return d['source']['y']; })
          .attr("x2", function(d) { return d['target']['x']; })
          .attr("y2", function(d) { return d['target']['y']; });

      node
          .attr("cx", function (d) { return d['x']+6; })
          .attr("cy", function(d) { return d['y']-6; });
    }
    }

  /**
   * @description draw a scatter chart using the data using d3
   */

  drawScatterChart(data_str:string){
    let data:Array<{
          "category" : string,
          "x" : number,
          "y" : number
      }>= JSON.parse(data_str);
  

    // append the svg object to the body of the page
    var svg = d3.select("figure#scatter")
    .append("svg")
      .attr("width", this.width + this.margina['left'] + this.margina['right'])
      .attr("height", this.height + this.margina['top'] + this.margina['bottom'])
    .append("g")
    .attr("transform",
          "translate(" + this.margina['left'] + "," + this.margina['top'] + ")");

    // Add X axis
    var x = d3.scaleLinear()
    .domain([d3.min(data, d => d['x']), d3.max(data, d => d['x'])])
    .range([ 0, this.width ]);
    svg.append("g")
    .attr("transform", "translate(0," + this.height + ")")
    .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([d3.min(data, d => d['y']), d3.max(data, d => d['y'])])
    .range([ this.height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    // Color scale: give me a specie name, I return a color
    let color = d3.scaleOrdinal()
    .domain(['0', '1', '2' ])
    .range([ "#4434ff", "#218dff", "#fd25ff"])


    // console.log(color('0'));
    // Highlight the specie that is hovered
    let highlight = function(d){
      let selected_specie:string = d['srcElement']['classList'][1];
      console.log(d);
      console.log(selected_specie);
      let colorset = <string> color(selected_specie);
      console.log(colorset);
      d3.selectAll(".dot")
        .transition()
        // .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3)

      d3.selectAll("." + selected_specie)
        .transition()
        // .duration(200)
        .style("fill", colorset)
        .attr("r", 7)
    }

    // Highlight the specie that is hovered
    var doNotHighlight = function(){
    d3.selectAll(".dot")
      .transition()
      // .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 5 )
    }

    // Add dots
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("class", function (d) { return "dot type" + d['category']} )
      .attr("cx", function (d) { return x(d['x']); } )
      .attr("cy", function (d) { return y(d['y']); } )
      .attr("r", 5)
      .style("fill", function(d){return color[d['category']]} )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight )

  }
  /**
   * @description draw a tree chart using the data using d3
   */

  drawTreeChart(data_str:string){
    let data = JSON.parse(data_str);
    // let ex_data={'name': 18.0, 'children': [{'name': 13.0, 'parent': 18.0, 'children': [{'name': 9.0, 'parent': 13.0, 'children': [], 'title': '통일 이후 북한지역의 도시개발 방향에 관한 연구'}, {'name': 12.0, 'parent': 13.0, 'children': [{'name': 7.0, 'parent': 12.0, 'children': [], 'title': '새 통일 한국의 영.유아 교육 연구'}, {'name': 11.0, 'parent': 12.0, 'children': [{'name': 8.0, 'parent': 11.0, 'children': [], 'title': '민간 통일 운동의 주요 논의 동향과 통일 정책 수용여부에 관한 연구'}, {'name': 10.0, 'parent': 11.0, 'children': [{'name': 5.0, 'parent': 10.0, 'children': [], 'title': '알기쉬운 통일교육 12주제:프리젠테이션-제1부-통일비전'}, {'name': 6.0, 'parent': 10.0, 'children': [], 'title': '통일 후 남북한경제 한시분리운영방안: 노동 및 사회복지 분야'}]}]}]}]}, {'name': 17.0, 'parent': 18.0, 'children': [{'name': 1.0, 'parent': 17.0, 'children': [], 'title': '통일 비용·편익의 분석모형 구축'}, {'name': 16.0, 'parent': 17.0, 'children': [{'name': 2.0, 'parent': 16.0, 'children': [], 'title': '통일대비를 위한 국내과제'}, {'name': 15.0, 'parent': 16.0, 'children': [{'name': 0.0, 'parent': 15.0, 'children': [], 'title': '한반도 통일에 대한 국제사회의 기대와 역할: 주변 4국과 G20'}, {'name': 14.0, 'parent': 15.0, 'children': [{'name': 3.0, 'parent': 14.0, 'children': [], 'title': '통일대계 탐색연구'}, {'name': 4.0, 'parent': 14.0, 'children': [], 'title': '한반도 통일의 미래와 주변 4국의 기대'}]}]}]}]}]}
    // data=ex_data;
    let width = 600;
    const dx = width/4;
    const dy = width/10;
    const margin = ({top: 10, right: 40, bottom: 10, left: 40});

    let diagonal:Function = d3.linkHorizontal().x(d => d['y']).y(d => d['x']);

    const tree = d3.tree().nodeSize([dx, dy]);
    const root = d3.hierarchy(data);

    root['x0'] = dy / 2;
    root['y0'] = 0;
    root.descendants().forEach((d, i) => {
        d['num'] = i;
        d['_children'] = d['children'];
        // if (d['depth'] && d['data']['name']['length'] !== 7) d['children'] = null;
      });
    
    const svg = d3.select("figure#tree")
      .append("svg")
        .attr("viewBox", [-margin.left, -margin.top, width, dx].join())
        .style("font", "10px sans-serif")
        .style("user-select", "none");
  
    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);
  
    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");
  
    function update(source) {
      // const duration = d3.event && d3.event.altKey ? 2500 : 250;
      const nodes = root.descendants().reverse();
      const links = root.links();
    
      // Compute the new tree layout.
      tree(root);

      let left = root;
      let right = root;
      root.eachBefore(node => {
        if (node['x'] < left['x']) left = node;
        if (node['x'] > right['x']) right = node;
      });

      const height = right['x'] - left['x'] + margin['top'] + margin['bottom'];

      const transition = svg.transition()
          // .duration(duration)
          .attr("viewBox", [-margin['left'], left['x'] - margin['top'], width, height].join())
          .tween("resize", window['ResizeObserver'] ? null : () => () => svg.dispatch("toggle"));

      // Update the nodes…
      const node = gNode.selectAll("g")
        .data(nodes, d => d['num']);

      // Enter any new nodes at the parent's previous position.
      const nodeEnter = node.enter().append("g")
          .attr("transform", d => `translate(${source['y0']},${source['x0']})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0)
          .on("click", (event, d) => {
            d['children'] = d['children'] ? null : d['_children'];
            update(d);
          });
      
      nodeEnter.append("circle")
          .attr("r", 2.5)
          .attr("fill", d => d['_children'] ? "#555" : "#999")
          .attr("stroke-width", 10);

      nodeEnter.append("text")
          .attr("dy", "0.31em")
          .attr("x", d => d['_children'] ? -6 : 6)
          .attr("text-anchor", d => d['_children'] ? "end" : "start")
          .text(d => d.data.title? d.data.title: null)
        .clone(true).lower()
          .attr("stroke-linejoin", "round")
          .attr("stroke-width", 3)
          .attr("stroke", "white");

      // Transition nodes to their new position.
      const nodeUpdate = node.merge(nodeEnter).transition(transition)
          .attr("transform", d => `translate(${d['y']},${d['x']})`)
          .attr("fill-opacity", 1)
          .attr("stroke-opacity", 1);

      // Transition exiting nodes to the parent's new position.
      const nodeExit = node.exit().transition(transition).remove()
          .attr("transform", d => `translate(${source['y']},${source['x']})`)
          .attr("fill-opacity", 0)
          .attr("stroke-opacity", 0);

      // Update the links…
      const link = gLink.selectAll("path")
        .data(links, d => d['target']['num']);

      // Enter any new links at the parent's previous position.
      const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source['x0'], y: source['y0']};
          return diagonal({source: o, target: o});
        });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", <null>diagonal);
    
        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", d => {
              const o = {x: source['x'], y: source['y']};
              return diagonal({source: o, target: o});
            });
    
        // Stash the old positions for transition.
        root.eachBefore(d => {
          d['x0'] = d['x'];
          d['y0'] = d['y'];
        });
      }
    
      update(root);
    
      return svg.node();
  }

  /**
   * @description draw a dendrogram chart using the data using d3
   */

  drawDendrogramChart(data_str:string){
    let data = JSON.parse(data_str);
  
  //   let ex_data={
  //     "name":18.0,
  //     // "parent":0.0,
  //     "children":[
  //        {
  //           "name":14.0,
  //           "parent":18.0,
  //           "children":[
  //              {
  //                 "name":10.0,
  //                 "parent":14.0,
  //                 "children":[
  //                    {
  //                       "name":6.0,
  //                       "parent":10.0,
  //                       "children":[
                           
  //                       ]
  //                    },
  //                    {
  //                       "name":9.0,
  //                       "parent":10.0,
  //                       "children":[
                           
  //                       ]
  //                    }
  //                 ]
  //              },
  //              {
  //                 "name":13.0,
  //                 "parent":14.0,
  //                 "children":[
  //                    {
  //                       "name":2.0,
  //                       "parent":13.0,
  //                       "children":[
                           
  //                       ]
  //                    },
  //                    {
  //                       "name":12.0,
  //                       "parent":13.0,
  //                       "children":[
  //                          {
  //                             "name":4.0,
  //                             "parent":12.0,
  //                             "children":[
                                 
  //                             ]
  //                          },
  //                          {
  //                             "name":11.0,
  //                             "parent":12.0,
  //                             "children":[
  //                                {
  //                                   "name":0.0,
  //                                   "parent":11.0,
  //                                   "children":[
                                       
  //                                   ]
  //                                },
  //                                {
  //                                   "name":8.0,
  //                                   "parent":11.0,
  //                                   "children":[
                                       
  //                                   ]
  //                                }
  //                             ]
  //                          }
  //                       ]
  //                    }
  //                 ]
  //              }
  //           ]
  //        },
  //        {
  //           "name":17.0,
  //           "parent":18.0,
  //           "children":[
  //              {
  //                 "name":15.0,
  //                 "parent":17.0,
  //                 "children":[
  //                    {
  //                       "name":3.0,
  //                       "parent":15.0,
  //                       "children":[
                           
  //                       ]
  //                    },
  //                    {
  //                       "name":7.0,
  //                       "parent":15.0,
  //                       "children":[
                           
  //                       ]
  //                    }
  //                 ]
  //              },
  //              {
  //                 "name":16.0,
  //                 "parent":17.0,
  //                 "children":[
  //                    {
  //                       "name":1.0,
  //                       "parent":16.0,
  //                       "children":[
                           
  //                       ]
  //                    },
  //                    {
  //                       "name":5.0,
  //                       "parent":16.0,
  //                       "children":[
                           
  //                       ]
  //                    }
  //                 ]
  //              }
  //           ]
  //        }
  //     ]
  //  }


   // set the dimensions and margins of the graph
  var width = 460
  var height = 460

  // append the svg object to the body of the page
  var svg = d3.select("figure#ngrams")
    .append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(40,0)");  // bit of margin on the left = 40

  // // read json data
  // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram.json")
  // .then((data) => {
  // Create the cluster layout:
  var cluster = d3.cluster()
    .size([height, width - 100]);  // 100 is the margin I will have on the right side

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data, d=>d['children']);
  cluster(root);


  // Add the links between nodes:
  svg.selectAll('path')
    .data( root.descendants().slice(1) )
    .enter()
    .append('path')
    .attr("d", function(d) {
        return "M" + d['y'] + "," + d['x']
                + "C" + (d['parent']['y'] + 50) + "," + d['x']
                + " " + (d['parent']['y'] + 150) + "," + d['parent']['x'] // 50 and 150 are coordinates of inflexion, play with it to change links shape
                + " " + d['parent']['y'] + "," + d['parent']['x'];
              })
    .style("fill", 'none')
    .attr("stroke", '#ccc')


  // Add a circle for each node.
  svg.selectAll("g")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("transform", function(d) {
          return "translate(" + d['y'] + "," + d['x'] + ")"
      })
      .append("circle")
        .attr("r", 7)
        .style("fill", "#69b3a2")
        .attr("stroke", "black")
        .style("stroke-width", 2)

// })
  }

  // drawTopicModeling(data_str:string){
  //   // let data = JSON.parse(data_str);
  //   var data = {"mdsDat": {"x": [-0.14198696843429942, -0.15380267926591257, 0.29578964770021215], "y": [-0.08176398920896776, 0.07961515437574983, 0.002148834833217854], "topics": [1, 2, 3], "cluster": [1, 1, 1], "Freq": [48.82380989417058, 38.85546005632252, 12.320730049506892]}, "tinfo": {"Term": ["\ubd81\ud55c", "\uc911\uc559", "\uc6d0\ud68c", "\uc559", "\ud68c", "\uc758\uc6d0", "\uac83", "\uc704\uc6d0", "\uc704\uc6d0\ud68c", "\uc6d0\uc7a5", "\uc6d0", "\ub300\uc758\uc6d0", "\ucc38\uc11d", "\ubcc0\ud654", "\uc218", "\ub300\ud68c", "\uc704", "\ub4f1", "\ub144", "\ud604\uc9c0", "\uad6d", "\uccb4\uc81c", "\uc8fc\ubbfc", "\uc559\ubcf4", "\ud45c", "\ubcf4\uace0\ub300\ud68c", "\uc0ac\ud68c", "\u3131", "\uc704\uc6d0\uc7a5", "\ud45c\ub2e8", "\ubcf4\uace0\ub300\ud68c", "\ub300\ud45c\ub2e8", "\uad00\ub78c", "\ub300\uc0ac", "\uc900\uacf5\uc2dd", "\uc601\uc811", "\ud611\ud68c", "\ud604\uc9c0", "\ub300\uc758\uc6d0", "\ucd94\ub300", "\uc0ac\ub839\uad00", "\u3134", "\uc704\uc6d0", "\uad70\uc911\ub300\ud68c", "\uc804\uc2dc\ud68c", "\ub300\ud68c", "\ubc1c\uc804\uc18c", "\uad00\ud558", "\uae08\uc218", "\uc911\uc559\uad70", "\uc911\ub300", "\uc804\uc1a1", "\uc704\uc6d0\ud68c", "\uc911\uc7a5", "\uc131\uc808", "\uad6c\ubd84\ub300", "\uc2dc\uc704", "\uc601\ub3c4", "\uac1c\uad00\uc2dd", "\ubd80\uc704\uc6d0\uc7a5", "\uc911\uc559", "\uc704", "\ubd80\ub300", "\uc704\uc6d0\uc7a5", "\uc81c\uad70", "\uc804\uad6d", "\uad81\uc804", "\uc804\uc784", "\uae40\uc601\ub0a8", "\ucd2c\uc601", "\uae08\uc218\uc0b0", "\ub300\ud45c", "\ub300\ud559", "\uc911\uad6d", "\ud604\uc9c1", "\uc811\uacac", "\uad00\ucca0", "\ucc38\uac00", "\uae40\uc815\uc740", "\uc218\ud589", "\uc2dc", "\ucc38\uc11d", "\ub3cc", "\uc81c\ucc28", "\ucd5c\uace0", "\ubbfc\ud68c", "\ub2f9", "\uc81c\uae30", "\uae40\uc815\uc77c", "\uc8fc\uc694", "\uc778\ubbfc\uad70", "\ub3c4\uc2dc", "\uacbd\ucd95", "\uae30\ub150", "\uae40\uc77c\uc131", "\uc870\uc120", "\uad6d\uac00", "\ubc29\ubb38", "\uc559", "\uc6d0\ud68c", "\ub78c\uc2dc", "\uacac", "\uc559\ubcf4", "\ub78c", "\uc7c1", "\ub825", "\ud658", "\uc2dc\ud68c", "\uad6d\uacf5", "\uc0b0\ub2f9", "\ubd81\uc7a5", "\uc559\uad70", "\uba85\uc131", "\uc784", "\uc0ac\ub839", "\ub3d9\uac15", "\uad70\ubd80", "\ud45c\uc790", "\uba85\uc0ac", "\uacb0\uc2dd", "\ubaa8\ub780", "\uc791", "\ud559", "\ub9c8", "\ubd81\uace0", "\uc2ec", "\ub3cc\uaca9", "\uba85\uc131\ud638", "\uc758\uc6d0", "\uc6d0\uc7a5", "\ud45c", "\ud68c", "\ud45c\ub2e8", "\uc6d0", "\uc9c0\uc9c0", "\uad81", "\uad6d", "\ucd94", "\uc220", "\ucca0", "\u3131", "\uc1a1", "\u3142", "\u3145", "\u3141", "\u3137", "\ubd80", "\ucc38\uc11d", "\uc0ac", "\uae40\uc815\uc77c", "\ucd5c\uace0", "\ubbfc\ud68c", "\ub2f9", "\uc81c\uae30", "\ub3cc", "\uc7a5", "\uc218\ud589", "\uc2dc", "\uc778\ubbfc\uad70", "\uae40\uc77c\uc131", "\ubc29\ubb38", "\uae30\ub150", "\uc81c\ucc28", "\uae40\uc815\uc740", "\ud1b5\uc81c", "\ubcc0\ud654", "\ub54c\ubb38", "\uad8c\ub825", "\ud654\ud3d0", "\uc678\ubd80", "\uc774\ud6c4", "\ud574\ubc95", "\ub3c4\ubc1c", "\uc758\ubbf8", "\uacb0\uacfc", "\uc815\ub3c4", "\uac00\uce58\uad00", "\ubfd0", "\uaddc\uc815", "\uc790\uc2e0", "\uc811\uadfc", "\uc778\uc2dd", "\uc138\uc2b5", "\ud3c9\uac00", "\ud589\uc704", "\uc0ac\uc6a9", "\ubd80\uc815", "\ubcf4\uc720", "\ub0b4\uc6a9", "\uc804\ub9dd", "\uc774\ud574", "\uc694\uc778", "\ubaa9\uc801", "\ud655\uc0b0", "\uc8fc\ubbfc", "\uac83", "\uccb4\uc81c", "\uc720\uc9c0", "\uc704\ud611", "\uac15\uc88c", "\uac1c\ud601", "\uc9c0\uc18d", "\uc8fc\uc81c", "\uc81c\ub3c4", "\uc0dd\ud65c", "\ubd81\uc815", "\ud544\uc694", "\ucc28\uc6d0", "\uc2dc\uc7a5", "\ubbf8\uc0ac\uc77c", "\uac00\ub2a5", "\ubd81\ud55c", "\ud55c\uad6d", "\uc810", "\ud575\uc2e4\ud5d8", "\uc6b0\ub9ac", "\uc774", "\uc218", "\ub2f9\uad6d", "\ubb38\uc81c", "\uacbd\uc6b0", "\uc0ac\ud68c", "\uc9c0\uc6d0", "\ub4f1", "\ud575", "\ub144", "\uc815\ucc45", "\ud1b5\uc77c", "\uacbd\uc81c", "\ub0a8\ubd81", "\uad00\uacc4", "\uc815\ubd80", "\ubd81", "\uc815\uce58", "\uae40\uc815\uc77c", "\ubbf8\uad6d", "\uad6d\uc81c", "\ud68c\ub2f4", "\uad6d\uac00"], "Freq": [3908.0, 4332.0, 2639.0, 2479.0, 2979.0, 2612.0, 1004.0, 2950.0, 2771.0, 2096.0, 2983.0, 2465.0, 11001.0, 758.0, 943.0, 1977.0, 2223.0, 1066.0, 1722.0, 1810.0, 1733.0, 499.0, 485.0, 1055.0, 1204.0, 1331.0, 645.0, 2018.0, 1489.0, 1110.0, 1330.2556959434994, 1139.6976614602977, 914.6068689777536, 564.1108681858918, 513.7308727848534, 448.53643887073804, 409.04933944728873, 1806.571836802079, 2459.7200404471955, 353.764473652456, 299.46962732371395, 302.4090917953456, 2942.4264844781637, 265.9059286960405, 205.68572876769454, 1970.122646417077, 197.7768342077106, 185.9149960266824, 184.92213848569475, 171.11028247666937, 167.16714193084223, 163.21754411369014, 2757.9586983498125, 145.44628721229543, 138.5323852588179, 131.6292758011638, 130.63022136269493, 125.69613702363174, 122.73602490619069, 549.6849074476897, 4299.741584208155, 2195.1768824119586, 930.1556658797432, 1473.402257218257, 631.2135820008513, 674.5998318092261, 282.50371973973034, 326.1462034477396, 299.4473132853046, 251.81230913200102, 246.8660653344347, 1053.3964385007355, 716.3872299926694, 1295.5741082550696, 440.7075702116307, 386.3037834666637, 398.24491850180596, 1753.4326597788215, 2758.561932471013, 3591.899250944905, 3273.5741049409603, 5561.372420846132, 2952.1107250730647, 2161.7109281252287, 3497.6060090757414, 3244.421399600256, 3252.471117353632, 2885.2096447627055, 3271.4188344119348, 1409.4631897543982, 1894.1028575004411, 1431.9025200573888, 1264.0016967096276, 1663.847810200959, 1594.194474212624, 1458.0342639133673, 1465.7931961580434, 1395.6616054935087, 2477.2991573969152, 2636.2656184276357, 423.6656503763905, 365.52489818462266, 1053.3600591268792, 338.9683930772487, 237.5676878976035, 204.11402408221826, 170.61232821098503, 133.20350019028103, 127.31383353895005, 125.34451924918255, 94.81288492966958, 90.88276245838549, 90.87983038940253, 317.29348236712957, 260.62767484113385, 66.26357271832727, 486.14872420724055, 55.43719291712909, 55.4344162581629, 52.485853092095056, 52.476310917065724, 46.580971800122825, 681.3365771239069, 45.594765735405325, 42.63592737706241, 41.65373866127827, 38.70137831046748, 35.750165403613806, 2545.233475861136, 2043.2100535894576, 1176.4532467092056, 2858.523824131106, 1053.8746942170606, 2741.083748433259, 832.729307118966, 182.75625341297632, 1599.6408558740288, 296.2676260510253, 352.4498183261857, 299.3161074972048, 1614.509657424625, 174.93222936498205, 1442.3697316341882, 1372.0774080676042, 1370.939889630231, 1366.0748515800956, 1253.7147356249018, 5438.0350306018545, 870.6540756739921, 3148.7538124735047, 3102.1609777087688, 2895.973411018873, 2914.5848173145255, 2660.519029971903, 2349.896760869745, 1360.8846543322177, 2371.3214614528733, 2028.5345406570452, 1535.2832056996308, 1433.6405789272224, 1287.3095738995157, 1350.5192620834139, 1335.4982001590597, 1366.37166399078, 230.09246585534666, 756.1130034544813, 188.3168041854469, 119.00218080647817, 103.80876844772607, 99.06146935747913, 244.33887709815852, 97.16894550073104, 89.56697630588356, 83.87066550951626, 79.12334013704474, 79.12051479790276, 78.16938080214786, 73.42318556533311, 71.52523442920999, 71.5252212880977, 65.82693932488716, 64.88012875507509, 63.92783834143881, 61.07996219189128, 61.07955481741035, 59.18169566907323, 59.17963908500012, 59.179547097214105, 57.28299548954967, 56.33077078147483, 54.43670284403288, 54.43163037468961, 52.53428701500981, 52.53285791904847, 476.0297490055739, 976.4326869233041, 486.4566959618066, 99.06163362138274, 132.30166978002347, 163.63207892427297, 162.68112233353395, 93.36585504006311, 159.82666248673002, 144.64183127430215, 166.47680120687133, 104.76406160552021, 148.44979708762904, 135.14666802597986, 390.5674188345928, 146.5435210568713, 143.69536894396572, 2829.3533838260964, 255.74854271353098, 164.58141915820053, 221.564698729236, 261.42813144451145, 235.78816558999256, 625.1822670728169, 133.2491439760061, 354.5140150872735, 134.19350372837644, 410.5457992819661, 175.9854998008505, 553.960750030813, 311.8013001234356, 567.2066758306713, 213.97468137601467, 296.59637615031903, 381.164322218962, 322.3846263158985, 206.35514908459396, 227.35149265426404, 261.5660605590889, 206.3174340923267, 280.69247641459054, 176.0049749292617, 196.00946676675173, 190.50293334349516, 189.54269912748063], "Total": [3908.0, 4332.0, 2639.0, 2479.0, 2979.0, 2612.0, 1004.0, 2950.0, 2771.0, 2096.0, 2983.0, 2465.0, 11001.0, 758.0, 943.0, 1977.0, 2223.0, 1066.0, 1722.0, 1810.0, 1733.0, 499.0, 485.0, 1055.0, 1204.0, 1331.0, 645.0, 2018.0, 1489.0, 1110.0, 1331.5021636927693, 1140.8576823020633, 915.6420357784446, 564.9766217327897, 514.5988787570654, 449.4040072250978, 409.892740156842, 1810.4753644457576, 2465.3290715794774, 354.5764128695666, 300.2481118662926, 303.21138715200027, 2950.2588303027815, 266.66336572940713, 206.40824930858162, 1977.287160692782, 198.505989655257, 186.65200732693265, 185.66423418280522, 171.83534314822316, 167.88425121493577, 163.93318329851644, 2771.2507024698953, 146.15261552780052, 139.23810568976438, 132.3238321995537, 131.33562540568272, 126.39683147157126, 123.43347073172453, 553.0186673199081, 4332.195407169442, 2223.398268297007, 936.1791897414016, 1489.9245406047191, 639.0225263686453, 685.0992195974073, 284.3930728688109, 328.81182392890344, 302.20029067251784, 253.76927084155855, 248.82974298197414, 1108.0866528510007, 753.1906821582397, 1398.5469119325305, 456.2187281410006, 398.5635675752964, 412.31858272381817, 2199.0351202406796, 4196.339148210838, 5972.08519670801, 5346.353978920519, 11001.531687404467, 5303.696943065986, 3563.4535147526803, 6625.266377232965, 6147.499969386766, 6276.6973135289045, 5579.123063112908, 6700.86512330003, 2152.379277217925, 3430.1888729481047, 2271.2000358789564, 1895.722824580367, 3016.7536321509997, 3142.4177727548886, 2591.0250824444734, 2799.44081638258, 2692.639111308559, 2479.288752172702, 2639.8454947969226, 424.5156897378636, 366.3975363545642, 1055.9122333192643, 339.80352461693025, 238.34473471332345, 204.85387305165594, 171.3630334225477, 133.93191598582467, 128.02195429158672, 126.05157764691151, 95.51572069667867, 91.5756745761906, 91.57580932604256, 320.02562629614806, 262.9527329612858, 66.9498135690191, 491.37220566397974, 56.114413697738094, 56.11453856482155, 53.159478278317245, 53.15941756997437, 47.24922432502453, 691.3043622661071, 46.26428801568296, 43.30910404332298, 42.324082064299105, 39.36905825425944, 36.41395075700714, 2612.3479965630536, 2096.2303299260793, 1204.138096170536, 2979.7991876468036, 1110.2271255988514, 2983.858110724823, 885.8118041790748, 188.92729680965778, 1733.396508531169, 313.2269866357874, 377.6507912421106, 324.0842061192798, 2018.4131873314352, 185.07217422748798, 1847.0149761984608, 1777.081743400187, 1776.0958639076607, 1771.169893931083, 1805.7361189565024, 11001.531687404467, 1216.5066233255968, 6700.86512330003, 6625.266377232965, 6147.499969386766, 6276.6973135289045, 5579.123063112908, 5303.696943065986, 2544.2519096890055, 5972.08519670801, 5346.353978920519, 3430.1888729481047, 3142.4177727548886, 2692.639111308559, 3016.7536321509997, 3563.4535147526803, 4196.339148210838, 230.82279714756723, 758.9725938315489, 189.03073639281584, 119.69416140470418, 104.49719584976324, 99.74812253770504, 246.03466589804646, 97.84828070318216, 90.2499441249467, 84.55100123044136, 79.8019305431909, 79.80201814858609, 78.85226918384085, 74.1031285990988, 72.20346742921693, 72.20348137377303, 66.50463841148299, 65.55470154445152, 64.60497263996733, 61.755514528526625, 61.75553303914382, 59.85584805316145, 59.85592911308749, 59.85592572934147, 57.95620589153214, 57.00649568768401, 55.106705455785296, 55.10686064499456, 53.2071718123715, 53.20721958215396, 485.6575921353824, 1004.9560449461012, 499.0640580637957, 100.71115608228513, 134.93965295760873, 168.2325806371088, 167.3098540645346, 95.00820097625117, 164.43396336242185, 149.23602602853492, 173.0554729104687, 107.39495595334823, 154.02522987112494, 139.73773171046872, 429.773864327282, 155.08168252264866, 152.22329517114602, 3908.8826461348326, 291.93037149130754, 180.05196422981487, 255.76131827719092, 317.36925154778856, 282.82868330300414, 943.2412127004214, 144.74228158703954, 494.29356215844865, 146.6801430552144, 645.0116195215646, 211.16624592550852, 1066.6258634966691, 481.1908069677992, 1722.2953821781389, 334.0012806114682, 704.7341164791536, 1307.9528282792928, 1354.8048526881964, 436.08535178627255, 653.1113996412826, 1420.025691220032, 574.9428686716484, 6700.86512330003, 305.86111873009133, 1374.5612173829882, 1992.0334189889998, 2799.44081638258], "Category": ["Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Default", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic1", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic2", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3", "Topic3"], "logprob": [30.0, 29.0, 28.0, 27.0, 26.0, 25.0, 24.0, 23.0, 22.0, 21.0, 20.0, 19.0, 18.0, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, -5.1248, -5.2794, -5.4994, -5.9826, -6.0762, -6.2119, -6.304, -4.8187, -4.5101, -6.4492, -6.6159, -6.6061, -4.3309, -6.7347, -6.9915, -4.732, -7.0307, -7.0926, -7.0979, -7.1756, -7.1989, -7.2228, -4.3956, -7.3381, -7.3868, -7.4379, -7.4455, -7.484, -7.5078, -6.0085, -3.9516, -4.6239, -5.4825, -5.0226, -5.8702, -5.8038, -6.6742, -6.5305, -6.6159, -6.7892, -6.809, -5.3581, -5.7437, -5.1512, -6.2295, -6.3613, -6.3308, -4.8485, -4.3954, -4.1314, -4.2242, -3.6943, -4.3276, -4.6392, -4.158, -4.2332, -4.2307, -4.3505, -4.2249, -5.0669, -4.7714, -5.0511, -5.1758, -4.901, -4.9438, -5.033, -5.0277, -5.0768, -4.2746, -4.2124, -6.0406, -6.1882, -5.1298, -6.2636, -6.6191, -6.7708, -6.9501, -7.1976, -7.2429, -7.2584, -7.5376, -7.5799, -7.58, -6.3297, -6.5264, -7.8959, -5.903, -8.0743, -8.0743, -8.129, -8.1291, -8.2483, -5.5655, -8.2697, -8.3368, -8.3601, -8.4336, -8.513, -4.2475, -4.4672, -5.0193, -4.1314, -5.1293, -4.1734, -5.3648, -6.8814, -4.712, -6.3982, -6.2246, -6.388, -4.7027, -6.9251, -4.8155, -4.8654, -4.8663, -4.8698, -4.9556, -3.4883, -5.3203, -4.0347, -4.0497, -4.1184, -4.112, -4.2032, -4.3274, -4.8736, -4.3183, -4.4744, -4.753, -4.8215, -4.9292, -4.8813, -4.8925, -4.8696, -5.5025, -4.3128, -5.7028, -6.1618, -6.2984, -6.3452, -5.4424, -6.3645, -6.446, -6.5117, -6.5699, -6.57, -6.5821, -6.6447, -6.6709, -6.6709, -6.7539, -6.7684, -6.7832, -6.8288, -6.8288, -6.8603, -6.8604, -6.8604, -6.8929, -6.9097, -6.9439, -6.944, -6.9795, -6.9795, -4.7755, -4.057, -4.7538, -6.3452, -6.0559, -5.8433, -5.8492, -6.4044, -5.8669, -5.9667, -5.8261, -6.2892, -5.9407, -6.0346, -4.9733, -5.9536, -5.9732, -2.9931, -5.3968, -5.8375, -5.5402, -5.3748, -5.478, -4.5029, -6.0487, -5.0702, -6.0417, -4.9235, -5.7705, -4.6239, -5.1986, -4.6002, -5.5751, -5.2486, -4.9977, -5.1652, -5.6113, -5.5144, -5.3743, -5.6115, -5.3037, -5.7704, -5.6628, -5.6913, -5.6963], "loglift": [30.0, 29.0, 28.0, 27.0, 26.0, 25.0, 24.0, 23.0, 22.0, 21.0, 20.0, 19.0, 18.0, 17.0, 16.0, 15.0, 14.0, 13.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.716, 0.7159, 0.7158, 0.7154, 0.7153, 0.715, 0.7149, 0.7148, 0.7147, 0.7147, 0.7144, 0.7143, 0.7143, 0.7141, 0.7134, 0.7133, 0.7133, 0.713, 0.7129, 0.7127, 0.7127, 0.7126, 0.7121, 0.7121, 0.7119, 0.7117, 0.7116, 0.7114, 0.7113, 0.7109, 0.7094, 0.7042, 0.7105, 0.7058, 0.7047, 0.7015, 0.7103, 0.7088, 0.7078, 0.7092, 0.709, 0.6663, 0.6669, 0.6405, 0.6824, 0.6857, 0.6822, 0.4905, 0.2974, 0.2085, 0.2264, 0.0348, 0.1311, 0.2171, 0.0781, 0.0778, 0.0595, 0.0575, -0.0001, 0.2936, 0.1231, 0.2556, 0.3116, 0.1219, 0.0383, 0.142, 0.0699, 0.0598, 0.9445, 0.944, 0.9433, 0.9429, 0.9429, 0.9429, 0.9421, 0.9417, 0.9409, 0.9399, 0.9398, 0.9397, 0.9379, 0.9377, 0.9377, 0.9367, 0.9364, 0.935, 0.9346, 0.9332, 0.9331, 0.9326, 0.9324, 0.9311, 0.9308, 0.9307, 0.9297, 0.9294, 0.9282, 0.9269, 0.9193, 0.9197, 0.9221, 0.9038, 0.8932, 0.8605, 0.8835, 0.9121, 0.865, 0.8897, 0.8763, 0.8658, 0.722, 0.889, 0.698, 0.6867, 0.6864, 0.6856, 0.5805, 0.2407, 0.6108, 0.1901, 0.1865, 0.1926, 0.1782, 0.2048, 0.1313, 0.3196, 0.0217, -0.0238, 0.1414, 0.1605, 0.2074, 0.1416, -0.0361, -0.1767, 2.0907, 2.0901, 2.0901, 2.0881, 2.0873, 2.087, 2.087, 2.0869, 2.0863, 2.0858, 2.0853, 2.0853, 2.0852, 2.0847, 2.0844, 2.0844, 2.0836, 2.0835, 2.0834, 2.0829, 2.0829, 2.0826, 2.0825, 2.0825, 2.0822, 2.082, 2.0817, 2.0816, 2.0812, 2.0811, 2.0739, 2.0651, 2.0683, 2.0774, 2.0741, 2.0662, 2.0658, 2.0764, 2.0655, 2.0626, 2.0551, 2.0691, 2.057, 2.0605, 1.9982, 2.0373, 2.0362, 1.7707, 1.9616, 2.004, 1.9504, 1.9, 1.912, 1.6826, 2.0112, 1.7615, 2.0049, 1.6421, 1.9116, 1.4387, 1.66, 0.9832, 1.6486, 1.2284, 0.8609, 0.6582, 1.3456, 1.0386, 0.4021, 1.069, -1.0788, 1.5413, 0.1462, -0.2534, -0.5987]}, "token.table": {"Topic": [1, 2, 3, 1, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 3, 1, 2, 3, 1, 1, 3, 1, 2, 3, 2, 3, 2, 1, 2, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 1, 3, 1, 1, 1, 2, 3, 1, 2, 3, 2, 1, 2, 3, 1, 2, 3, 1, 1, 2, 3, 1, 3, 3, 3, 1, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 3, 1, 2, 3, 3, 1, 2, 3, 1, 2, 3, 2, 2, 1, 2, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 1, 2, 3, 1, 3, 1, 2, 3, 3, 1, 2, 3, 1, 2, 3, 1, 3, 3, 1, 2, 3, 2, 2, 2, 3, 1, 2, 3, 3, 1, 2, 3, 1, 2, 1, 3, 1, 2, 3, 2, 1, 2, 3, 1, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 1, 2, 3, 2, 2, 1, 2, 3, 2, 1, 2, 1, 1, 3, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 3, 2, 3, 3, 1, 2, 3, 1, 2, 3, 3, 2, 3, 1, 2, 3, 3, 2, 3, 3, 2, 1, 2, 3, 2, 1, 2, 3, 3, 1, 1, 1, 3, 1, 2, 3, 1, 3, 3, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 1, 2, 3, 1, 1, 2, 3, 1, 1, 1, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 3, 1, 2, 3, 1, 2, 1, 1, 2, 3, 3, 3, 1, 2, 3, 1, 2, 2, 1, 2, 3, 1, 2, 3, 1, 2, 3, 3, 1, 2, 3, 1, 2, 3, 3, 1, 2, 3, 1, 2, 3, 1, 3, 3, 2, 1, 2, 3, 1, 2, 3], "Freq": [0.1996617949830235, 0.800133496023779, 0.0004954386972283461, 0.9960048098345561, 0.2280978247113994, 0.7712416548410187, 0.0005645985760183153, 0.22802823216363052, 0.77191779332429, 0.0005630326720089643, 0.21873130711236335, 0.7807191704357127, 0.0005414141265157508, 0.22733900761762646, 0.7720522733945137, 0.000562720315885214, 0.006569296761548165, 0.045985077330837155, 0.9459787336629358, 0.9891915706084017, 0.011888303635513745, 0.011888303635513745, 0.9748408981121272, 0.9964882237438932, 0.023907737068834714, 0.9742402855550146, 0.0159210943408556, 0.011940820755641702, 0.9711867547921917, 0.9989150135709988, 0.9899509881812085, 0.9781886821340349, 0.04090533234441582, 0.04090533234441582, 0.9135524223586199, 0.3318162479689414, 0.3769249084071154, 0.2912949089312596, 0.6667641406278876, 0.3328545670381306, 0.43340139545120465, 0.09401829213491741, 0.47238458975104847, 0.9992988135610237, 0.0010921298508863647, 0.9652730113951494, 0.03395432703400023, 0.9965068292794161, 0.9975527295864185, 0.05422879274151356, 0.9230432807066137, 0.02249917996722371, 0.5236760110879415, 0.40865304003042635, 0.06787069720785054, 0.9920173512641505, 0.4816082336881106, 0.3761200254029505, 0.14259095740614755, 0.004070234288684373, 0.9890669321503026, 0.006105351433026559, 0.9975123477212829, 0.010586082761851924, 0.968626572709451, 0.021172165523703847, 0.9951015935277244, 0.0035162600478011465, 0.994200540807023, 0.997182026896196, 0.9964223902049373, 0.9926466066313194, 0.00803762434519287, 0.5515863086285697, 0.44783239360408517, 0.0006629643132554924, 0.9894100344331374, 0.006618127320622992, 0.507252731899672, 0.45633652292605376, 0.036596025199788135, 0.6574778402208826, 0.3255218302797121, 0.016919509480131448, 0.4881459244159661, 0.4699393200812832, 0.04193488375447462, 0.41112932161027, 0.35060399957787836, 0.23767260602963544, 0.983501233788117, 0.3832095277206843, 0.2874071457905132, 0.32921182154186057, 0.5181068701513742, 0.46441621355819684, 0.017525140134271578, 0.03454415631132146, 0.04145298757358575, 0.9188745578811508, 0.9982713944343495, 0.9978383934052004, 0.0004056253631728457, 0.0020281268158642285, 0.950286692192106, 0.0009024564978082679, 0.048732650881646467, 0.9992482127127964, 0.0008765335199235056, 0.0008765335199235056, 0.9506224877189515, 0.0477966613936903, 0.9963145663221579, 0.0005057434346812985, 0.0030344606080877907, 0.9972305342970555, 0.6305036885250905, 0.36588586952817753, 0.003522366975000506, 0.5565928882605977, 0.44308715698252193, 0.0003770954527510825, 0.990625677356163, 0.9858130513232882, 0.24657193210918357, 0.23438396588325433, 0.5193948683972917, 0.9945472550523534, 0.9976353258317845, 0.9987852280838382, 0.9958317944448107, 0.9942874293106301, 0.9801381496965519, 0.9937122114422984, 0.9886320833526286, 0.9781897992308095, 0.9961063179019914, 0.14768551643931674, 0.13352389157527267, 0.7181966895336636, 0.21905366814251565, 0.2059758372086341, 0.5754245610907873, 0.025792859188355957, 0.025792859188355957, 0.9478875751720814, 0.5276941872557016, 0.47108580958462143, 0.0011386742634987396, 0.9974510106413628, 0.5184504652469291, 0.47796973407793525, 0.003713828547614105, 0.002635141263669782, 0.9960833976671776, 0.9988718278244452, 0.000751031449492064, 0.000751031449492064, 0.9857002340384505, 0.2874174108561994, 0.6944536285427245, 0.018275095487966436, 0.9933995651589858, 0.0010681715754397698, 0.005340857877198848, 0.99454147301295, 0.005424771670979728, 0.9857001783153284, 0.37323268394154485, 0.4429497324513806, 0.18450370413714104, 0.9928628391154484, 0.9946006720891905, 0.01862284855229876, 0.9776995489956848, 0.16807872209969066, 0.1082150676532255, 0.7237362326027776, 0.9851136028943289, 0.26551437847252013, 0.7159845933423066, 0.01890659660949834, 0.0076059296949557, 0.9925738251917188, 0.9958430650619764, 0.9857015132021633, 0.17829136176694133, 0.18604316010463443, 0.6371978233583729, 0.9916575606069991, 0.017335481794049173, 0.017335481794049173, 0.9592299926040543, 0.9982899387449661, 0.9906358192682978, 0.043226379294417965, 0.9455770470653929, 0.010806594823604491, 0.06255027791999025, 0.2745851183267369, 0.6626088762710832, 0.6014649626867374, 0.39701376016989265, 0.0015070113207629836, 0.026479489072721248, 0.9320780153597878, 0.042367182516354, 0.6123799533118555, 0.3795109728985201, 0.008229907741515467, 0.9974445212055297, 0.053516516263736796, 0.037228880879121254, 0.9097807764835256, 0.993041867735818, 0.9923428448180693, 0.000403341482158405, 0.999076851306369, 0.000403341482158405, 0.9937136736490908, 0.0018940968168471655, 0.9972419740700327, 0.9968604318086841, 0.9991010155258908, 0.9924998835198903, 0.9799142859520686, 0.10082892354548573, 0.0756216926591143, 0.8223859076678679, 0.06099485741156423, 0.9186093635444921, 0.02010819475106513, 0.024806434320523218, 0.9746066407082487, 0.0004770468138562157, 0.0011364301455948592, 0.9985432879293497, 0.00037881004853161974, 0.9872275387176773, 0.00044976197663675505, 0.012143573369192386, 0.9972006421206325, 0.0003389533113938248, 0.0020337198683629486, 0.9886406726357766, 0.0006711749305062977, 0.010738798888100764, 0.9952185118228078, 0.0003608479013135634, 0.004330174815762761, 0.014821440222825381, 0.9782150547064752, 0.009929386563519925, 0.9830092697884727, 0.9934832086856119, 0.024881830477990495, 0.9742193625613202, 0.0011483921759072536, 0.07424989486480753, 0.09192844126119026, 0.8344273899092655, 0.9799170455458772, 0.004064467892562696, 0.9917301657852979, 0.5521561844412917, 0.4474972244547955, 0.0002915291364526355, 0.9915383407843694, 0.990545674947455, 0.006249499526482366, 0.9971818343118433, 0.994725324519401, 0.45160622484919233, 0.5349313072408622, 0.013756499451454945, 0.9985536298347933, 0.9852587489395448, 0.0014596425910215478, 0.014596425910215477, 0.9823441929635843, 0.9943075387194968, 0.9980221269743377, 0.9914485315786229, 0.0060825063287032076, 0.07775533057851382, 0.005553952184179558, 0.9164021103896272, 0.9684778825828758, 0.030108120702058313, 0.9924119817273399, 0.9899499014286484, 0.3506293109043524, 0.3016330753194647, 0.3475670461802969, 0.19760403277248345, 0.1616760268138501, 0.6407161062622948, 0.3078566752361707, 0.33394622398499874, 0.35829646948390487, 0.9874456282249787, 0.010954230424048892, 0.5171063565660614, 0.47695667758138277, 0.005914908064707115, 0.013401589771745775, 0.013401589771745775, 0.9716152584515687, 0.6067148037849605, 0.3746365694046819, 0.018521358487422472, 0.5627116502571509, 0.4299456641882483, 0.007333005044503338, 0.010295319338086648, 0.008236255470469318, 0.9801144009858488, 0.6546244032888173, 0.32196927713211526, 0.023230106575188692, 0.012162937382904805, 0.012162937382904805, 0.9730349906323845, 0.9988362221882179, 0.9266761014181284, 0.0007150278560325065, 0.07293284131531566, 0.9947329710289281, 0.992568339111352, 0.00023082984630496558, 0.007155725235453933, 0.995138700031561, 0.992113616826917, 0.010525407172481521, 0.9788628670407815, 0.09471210662643141, 0.07103407996982355, 0.8334665383125964, 0.037253962799223155, 0.9403803336894815, 0.022578159272256457, 0.01431252658475897, 0.01431252658475897, 0.9660955444712304, 0.7971678050363007, 0.19690454054804232, 0.005911683665414665, 0.5054750700183619, 0.4942948086243215, 0.0001817928681957784, 0.07405482756283024, 0.92259972672026, 0.012022504732715126, 0.012022504732715126, 0.9738228833499252, 0.9930280335531121, 0.007881174869469144, 0.5279787710907008, 0.46820758945779123, 0.003773433183895803, 0.05427373989255651, 0.9450015887174545, 0.9983743620595016, 0.3320401191431774, 0.24690162705518318, 0.42143553583557125, 0.9964353731185347, 0.9877660394493575, 0.010796103903151383, 0.9766321684696944, 0.012457042965174673, 0.05044012950935049, 0.9493552946938467, 0.9801403307224964, 0.025969771337766262, 0.0064924428344415655, 0.9608815394973517, 0.008679245101726107, 0.9850943190459132, 0.005786163401150738, 0.06165853832901372, 0.06165853832901372, 0.8769214340126396, 0.991330652954901, 0.21820865752122837, 0.13508154989409374, 0.64839143949165, 0.06255832628552298, 0.07037811707121334, 0.8679967772116313, 0.9877657433761453, 0.9980804132914444, 0.0005523411252304617, 0.0016570233756913852, 0.9666415971062524, 0.030687034828769916, 0.0021919310591978513, 0.9978220152020736, 0.9952420173027603, 0.9961054235913605, 0.997881495120056, 0.03892879777969438, 0.9594606280357434, 0.002013558505846261, 0.4462776535401634, 0.4578236445766356, 0.09588192556374714], "Term": ["\u3131", "\u3131", "\u3131", "\u3134", "\u3137", "\u3137", "\u3137", "\u3141", "\u3141", "\u3141", "\u3142", "\u3142", "\u3142", "\u3145", "\u3145", "\u3145", "\uac00\ub2a5", "\uac00\ub2a5", "\uac00\ub2a5", "\uac00\uce58\uad00", "\uac15\uc88c", "\uac15\uc88c", "\uac15\uc88c", "\uac1c\uad00\uc2dd", "\uac1c\ud601", "\uac1c\ud601", "\uac83", "\uac83", "\uac83", "\uacac", "\uacb0\uacfc", "\uacb0\uc2dd", "\uacbd\uc6b0", "\uacbd\uc6b0", "\uacbd\uc6b0", "\uacbd\uc81c", "\uacbd\uc81c", "\uacbd\uc81c", "\uacbd\ucd95", "\uacbd\ucd95", "\uad00\uacc4", "\uad00\uacc4", "\uad00\uacc4", "\uad00\ub78c", "\uad00\ub78c", "\uad00\ucca0", "\uad00\ucca0", "\uad00\ud558", "\uad6c\ubd84\ub300", "\uad6d", "\uad6d", "\uad6d", "\uad6d\uac00", "\uad6d\uac00", "\uad6d\uac00", "\uad6d\uacf5", "\uad6d\uc81c", "\uad6d\uc81c", "\uad6d\uc81c", "\uad70\ubd80", "\uad70\ubd80", "\uad70\ubd80", "\uad70\uc911\ub300\ud68c", "\uad81", "\uad81", "\uad81", "\uad81\uc804", "\uad81\uc804", "\uad8c\ub825", "\uaddc\uc815", "\uae08\uc218", "\uae08\uc218\uc0b0", "\uae08\uc218\uc0b0", "\uae30\ub150", "\uae30\ub150", "\uae30\ub150", "\uae40\uc601\ub0a8", "\uae40\uc601\ub0a8", "\uae40\uc77c\uc131", "\uae40\uc77c\uc131", "\uae40\uc77c\uc131", "\uae40\uc815\uc740", "\uae40\uc815\uc740", "\uae40\uc815\uc740", "\uae40\uc815\uc77c", "\uae40\uc815\uc77c", "\uae40\uc815\uc77c", "\ub0a8\ubd81", "\ub0a8\ubd81", "\ub0a8\ubd81", "\ub0b4\uc6a9", "\ub144", "\ub144", "\ub144", "\ub2f9", "\ub2f9", "\ub2f9", "\ub2f9\uad6d", "\ub2f9\uad6d", "\ub2f9\uad6d", "\ub300\uc0ac", "\ub300\uc758\uc6d0", "\ub300\uc758\uc6d0", "\ub300\uc758\uc6d0", "\ub300\ud45c", "\ub300\ud45c", "\ub300\ud45c", "\ub300\ud45c\ub2e8", "\ub300\ud45c\ub2e8", "\ub300\ud45c\ub2e8", "\ub300\ud559", "\ub300\ud559", "\ub300\ud68c", "\ub300\ud68c", "\ub300\ud68c", "\ub3c4\ubc1c", "\ub3c4\uc2dc", "\ub3c4\uc2dc", "\ub3c4\uc2dc", "\ub3cc", "\ub3cc", "\ub3cc", "\ub3cc\uaca9", "\ub3d9\uac15", "\ub4f1", "\ub4f1", "\ub4f1", "\ub54c\ubb38", "\ub78c", "\ub78c\uc2dc", "\ub825", "\ub9c8", "\uba85\uc0ac", "\uba85\uc131", "\uba85\uc131\ud638", "\ubaa8\ub780", "\ubaa9\uc801", "\ubb38\uc81c", "\ubb38\uc81c", "\ubb38\uc81c", "\ubbf8\uad6d", "\ubbf8\uad6d", "\ubbf8\uad6d", "\ubbf8\uc0ac\uc77c", "\ubbf8\uc0ac\uc77c", "\ubbf8\uc0ac\uc77c", "\ubbfc\ud68c", "\ubbfc\ud68c", "\ubbfc\ud68c", "\ubc1c\uc804\uc18c", "\ubc29\ubb38", "\ubc29\ubb38", "\ubc29\ubb38", "\ubcc0\ud654", "\ubcc0\ud654", "\ubcf4\uace0\ub300\ud68c", "\ubcf4\uace0\ub300\ud68c", "\ubcf4\uace0\ub300\ud68c", "\ubcf4\uc720", "\ubd80", "\ubd80", "\ubd80", "\ubd80\ub300", "\ubd80\ub300", "\ubd80\ub300", "\ubd80\uc704\uc6d0\uc7a5", "\ubd80\uc704\uc6d0\uc7a5", "\ubd80\uc815", "\ubd81", "\ubd81", "\ubd81", "\ubd81\uace0", "\ubd81\uc7a5", "\ubd81\uc815", "\ubd81\uc815", "\ubd81\ud55c", "\ubd81\ud55c", "\ubd81\ud55c", "\ubfd0", "\uc0ac", "\uc0ac", "\uc0ac", "\uc0ac\ub839", "\uc0ac\ub839", "\uc0ac\ub839\uad00", "\uc0ac\uc6a9", "\uc0ac\ud68c", "\uc0ac\ud68c", "\uc0ac\ud68c", "\uc0b0\ub2f9", "\uc0dd\ud65c", "\uc0dd\ud65c", "\uc0dd\ud65c", "\uc131\uc808", "\uc138\uc2b5", "\uc1a1", "\uc1a1", "\uc1a1", "\uc218", "\uc218", "\uc218", "\uc218\ud589", "\uc218\ud589", "\uc218\ud589", "\uc220", "\uc220", "\uc220", "\uc2dc", "\uc2dc", "\uc2dc", "\uc2dc\uc704", "\uc2dc\uc7a5", "\uc2dc\uc7a5", "\uc2dc\uc7a5", "\uc2dc\ud68c", "\uc2ec", "\uc559", "\uc559", "\uc559", "\uc559\uad70", "\uc559\ubcf4", "\uc559\ubcf4", "\uc601\ub3c4", "\uc601\uc811", "\uc678\ubd80", "\uc694\uc778", "\uc6b0\ub9ac", "\uc6b0\ub9ac", "\uc6b0\ub9ac", "\uc6d0", "\uc6d0", "\uc6d0", "\uc6d0\uc7a5", "\uc6d0\uc7a5", "\uc6d0\uc7a5", "\uc6d0\ud68c", "\uc6d0\ud68c", "\uc6d0\ud68c", "\uc704", "\uc704", "\uc704", "\uc704\uc6d0", "\uc704\uc6d0", "\uc704\uc6d0", "\uc704\uc6d0\uc7a5", "\uc704\uc6d0\uc7a5", "\uc704\uc6d0\uc7a5", "\uc704\uc6d0\ud68c", "\uc704\uc6d0\ud68c", "\uc704\uc6d0\ud68c", "\uc704\ud611", "\uc704\ud611", "\uc720\uc9c0", "\uc720\uc9c0", "\uc758\ubbf8", "\uc758\uc6d0", "\uc758\uc6d0", "\uc758\uc6d0", "\uc774", "\uc774", "\uc774", "\uc774\ud574", "\uc774\ud6c4", "\uc774\ud6c4", "\uc778\ubbfc\uad70", "\uc778\ubbfc\uad70", "\uc778\ubbfc\uad70", "\uc778\uc2dd", "\uc784", "\uc784", "\uc790\uc2e0", "\uc791", "\uc7a5", "\uc7a5", "\uc7a5", "\uc7c1", "\uc804\uad6d", "\uc804\uad6d", "\uc804\uad6d", "\uc804\ub9dd", "\uc804\uc1a1", "\uc804\uc2dc\ud68c", "\uc804\uc784", "\uc804\uc784", "\uc810", "\uc810", "\uc810", "\uc811\uacac", "\uc811\uacac", "\uc811\uadfc", "\uc815\ub3c4", "\uc815\ubd80", "\uc815\ubd80", "\uc815\ubd80", "\uc815\ucc45", "\uc815\ucc45", "\uc815\ucc45", "\uc815\uce58", "\uc815\uce58", "\uc815\uce58", "\uc81c\uad70", "\uc81c\uad70", "\uc81c\uae30", "\uc81c\uae30", "\uc81c\uae30", "\uc81c\ub3c4", "\uc81c\ub3c4", "\uc81c\ub3c4", "\uc81c\ucc28", "\uc81c\ucc28", "\uc81c\ucc28", "\uc870\uc120", "\uc870\uc120", "\uc870\uc120", "\uc8fc\ubbfc", "\uc8fc\ubbfc", "\uc8fc\ubbfc", "\uc8fc\uc694", "\uc8fc\uc694", "\uc8fc\uc694", "\uc8fc\uc81c", "\uc8fc\uc81c", "\uc8fc\uc81c", "\uc900\uacf5\uc2dd", "\uc911\uad6d", "\uc911\uad6d", "\uc911\uad6d", "\uc911\ub300", "\uc911\uc559", "\uc911\uc559", "\uc911\uc559", "\uc911\uc559\uad70", "\uc911\uc7a5", "\uc9c0\uc18d", "\uc9c0\uc18d", "\uc9c0\uc6d0", "\uc9c0\uc6d0", "\uc9c0\uc6d0", "\uc9c0\uc9c0", "\uc9c0\uc9c0", "\uc9c0\uc9c0", "\ucc28\uc6d0", "\ucc28\uc6d0", "\ucc28\uc6d0", "\ucc38\uac00", "\ucc38\uac00", "\ucc38\uac00", "\ucc38\uc11d", "\ucc38\uc11d", "\ucc38\uc11d", "\ucca0", "\ucca0", "\uccb4\uc81c", "\uccb4\uc81c", "\uccb4\uc81c", "\ucd2c\uc601", "\ucd2c\uc601", "\ucd5c\uace0", "\ucd5c\uace0", "\ucd5c\uace0", "\ucd94", "\ucd94", "\ucd94\ub300", "\ud1b5\uc77c", "\ud1b5\uc77c", "\ud1b5\uc77c", "\ud1b5\uc81c", "\ud3c9\uac00", "\ud45c", "\ud45c", "\ud45c", "\ud45c\ub2e8", "\ud45c\ub2e8", "\ud45c\uc790", "\ud544\uc694", "\ud544\uc694", "\ud544\uc694", "\ud559", "\ud559", "\ud559", "\ud55c\uad6d", "\ud55c\uad6d", "\ud55c\uad6d", "\ud574\ubc95", "\ud575", "\ud575", "\ud575", "\ud575\uc2e4\ud5d8", "\ud575\uc2e4\ud5d8", "\ud575\uc2e4\ud5d8", "\ud589\uc704", "\ud604\uc9c0", "\ud604\uc9c0", "\ud604\uc9c0", "\ud604\uc9c1", "\ud604\uc9c1", "\ud604\uc9c1", "\ud611\ud68c", "\ud654\ud3d0", "\ud655\uc0b0", "\ud658", "\ud68c", "\ud68c", "\ud68c", "\ud68c\ub2f4", "\ud68c\ub2f4", "\ud68c\ub2f4"]}, "R": 30, "lambda.step": 0.01, "plot.opts": {"xlab": "PC1", "ylab": "PC2"}, "topic.order": [2, 1, 3]};

  //   function LDAvis_load_lib(url, callback){
  //     let s = document.createElement('script');
  //     s.src = url;
  //     s.async = true;
  //     // s.onreadystatechange = 
  //     s.onload = callback;
  //     s.onerror = function(){
  //       console.warn("failed to load library " + url);
  //     };
  //     document.getElementsByTagName("head")[0].appendChild(s);
  //   }
  
  //   // LDAvis

  //   if(typeof(LDAvis) !== "undefined"){
  //     // already loaded: just create the visualization
  //     !function(LDAvis){
  //         new LDAvis("#" + "ldavis", data);
  //     }(LDAvis);
  //   }
  //   // else if(typeof(define) === "function" && define.amd){
  //   //   // require.js is available: use it to load d3/LDAvis

  //   //   require.config({paths: {d3: "https://d3js.org/d3.v5"}});
  //   //   require(["d3"], function(d3){
  //   //       window.d3 = d3;
  //   //       LDAvis_load_lib("https://cdn.jsdelivr.net/gh/bmabey/pyLDAvis@3.2.2/pyLDAvis/js/ldavis.v3.0.0.js", function(){
  //   //         new LDAvis("#" + "ldavis", data);
  //   //       });
  //   //     });
  //   // }
  //   else{
  //     // require.js not available: dynamically load d3 & LDAvis
  //     LDAvis_load_lib("https://d3js.org/d3.v5.js", function(){
  //         LDAvis_load_lib("https://cdn.jsdelivr.net/gh/bmabey/pyLDAvis@3.2.2/pyLDAvis/js/ldavis.v3.0.0.js", function(){
  //                 new LDAvis("#" + "ldavis", data);
  //             })
  //         });
  //   }
  // }

  public get isDataAnalysised(): boolean {
    return this._isDataAnalysised;
  }
  public set isDataAnalysised(value: boolean) {
    this._isDataAnalysised = value;
  }

  public get analysisedData(): any {
    return this._analysisedData;
  }
  public set analysisedData(value: any) {
    this._analysisedData = value;
  }
}
