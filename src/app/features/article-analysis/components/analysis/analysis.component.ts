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

  async runAnalysis(activity:string): Promise<void>{

    // Check the options
    if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');
    if(!this.isSelectedPreprocessed) return alert('선택하신 문서는 전처리되지 않은 문서입니다. 전처리를 먼저 해주세요!');
    let optionValue1 =  (<HTMLInputElement> document.getElementById(activity+'_option1')).value ;
    let optionValue2 =  (<HTMLInputElement> document.getElementById(activity+'_option2')) != null? (<HTMLInputElement> document.getElementById(activity+'_option2')).value:null;

    this.LoadingWithMask();
    document.getElementById("cancelbtn").addEventListener("click", this.closeLoadingWithMask);

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      'option1': optionValue1,
      'option2': optionValue2,
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
    // let temp=[];
    // // let i=0;
    // for (let i=0;i< Object.keys(this.analysisedData).length;i++){
    //   temp.push({word:Object.keys(this.analysisedData)[i], count:this.analysisedData[Object.keys(this.analysisedData)[i]]});
    // }


    if(activity=='count'|| activity=='tfidf'){
      this.drawTable(activity, JSON.stringify(this.analysisedData));
      this.drawBarChart(JSON.stringify(this.analysisedData));
    }
    else if(activity=='network')
      this.drawNetworkChart(JSON.stringify(this.analysisedData));
    else if(activity=='kmeans')
      this.drawScatterChart(JSON.stringify(this.analysisedData));

    alert("분석 완료되었습니다.");
    this.closeLoadingWithMask();
  }

  

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
    return table.node();
  }

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
    //           .attr("x",d.x-20)
    //           .attr("y",d.y-20)
    //           .attr("stroke","red")
    //           .attr("stroke-width",2)
    //           // .text(d => d.word);
    //         })
    // .on("mouseout",function(){d3.select(this).attr("fill","blue");});

    
 
  }

  drawNetworkChart(data_str:string){
    
    let data:any = JSON.parse(data_str);
    const margin = {top: 10, right: 30, bottom: 30, left: 40};
    
    // append the svg object to the body of the page
    const svg = d3.select("figure#network")
    .append("svg")
      .attr("width", this.width + margin.left + margin.right)
      .attr("height", this.height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

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

    // const g = d3.select("svg").select('g');
    //     g.append("text")
    //   .data(data['nodes'])
    //       .attr("dx", function(d){return -20})
    //       .text(function(d){return d['name']})

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


  drawScatterChart(data_str:string){
    let data:Array<{
          "category" : string,
          "x" : number,
          "y" : number
      }>= JSON.parse(data_str);
  

    // append the svg object to the body of the page
    var svg = d3.select("figure#scatter")
    .append("svg")
      .attr("width", this.width + this.margina.left + this.margina.right)
      .attr("height", this.height + this.margina.top + this.margina.bottom)
    .append("g")
    .attr("transform",
          "translate(" + this.margina.left + "," + this.margina.top + ")");

    // //Read the data

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
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3)

      d3.selectAll("." + selected_specie)
        .transition()
        .duration(200)
        .style("fill", colorset)
        .attr("r", 7)
    }

    // Highlight the specie that is hovered
    var doNotHighlight = function(){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
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
