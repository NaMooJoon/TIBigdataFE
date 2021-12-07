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
    else if(activity=='kmeans')
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
    
    const svg = d3.select("figure#bar")
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
    .attr("x", d => x(d.word))
    .attr("y", d => y(d.value))
    .attr("width", x.bandwidth())
    .attr("height", (d) => this.height - y(d.value))
    .attr("fill", "#d04a35")
    // .on("mouseover",function(d,i){
    //   console.log(this);
    //   var text = svg.append("text")
    //           // .attr("id","r"+"-"+i)
    //           .attr("x",d['x']-20)
    //           .attr("y",d['y']-20)
    //           .attr("stroke","red")
    //           .attr("stroke-width",2)
    //           // .text(d => d.word);
    //         })
    // .on("mouseout",function(){d3.select(this).attr("fill","blue");});

    
 
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
