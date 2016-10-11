import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
    selector: 'graphic'
})
export class GraphicComponent implements OnInit{

    constructor(private ele: ElementRef){

    }
    
    ngOnInit(){
        setTimeout(this.start.bind(this), 5000);
    }
  
    start() {
        window['d3'] = d3;
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
            width = 960 - margin.right - margin.left,
            height = 500 - margin.top - margin.bottom;

        var svg = d3.select(this.ele.nativeElement).append("svg")
          .attr("width", width + margin.right + margin.left)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var i = 0;
        var data = [
          new Foobar({ name: 'a', x: 20, y: 20, color: 'black' }),
          new Foobar({ name: 'b', x: 20, y: 80, color: 'black' }),
          new Foobar({ name: 'c', x: 20, y: 140, color: 'black' }),
          new Foobar({ name: 'd', x: 220, y: 90, color: 'red' })
        ];      
      
        var rects = svg.selectAll('g')
          .data(data);
        
        rects.enter()
          .append('g')
          .attr('transform', function(d) { 
            console.log(d);
            return "translate(" + d.x + "," + d.y + ")"; 
          })
          .append('rect')
          .attr("class", "node")
          .attr('width', 120)
          .attr('height', 30)
          .attr('fill', 'transparent')
          .attr('stroke', (d) => d.color)
          .on('mouseover', function(e){
            console.log(this);
            console.log(e);
          });
        
        var pathEnter = svg.selectAll('g.link')
          .data([{
            source: data[0],
            target: data[3]
          }]).enter();
      
        pathEnter.append('g')
          .append('path')
          .attr('class', "link_background")
          .attr('stroke', 'black')
          .attr('fill', 'transparent')
          .attr('d', (d) => {
            const lineCurveScale = 0.75,
              node_width = 100,
              node_height = 30;
            var dy = d.target.y-(d.source.y+1);
            var dx = (d.target.x-120/2)-(d.source.x+120/2);
            var delta = Math.sqrt(dy*dy+dx*dx);
            var scale = lineCurveScale;
            var scaleY = 0;
            if (delta < node_width) {
                scale = 0.75-0.75*((node_width-delta)/node_width);
            }

            if (dx < 0) {
                scale += 2*(Math.min(5*node_width,Math.abs(dx))/(5*node_width));
                if (Math.abs(dy) < 3*node_height) {
                    scaleY = ((dy>0)?0.5:-0.5)*(((3*node_height)-Math.abs(dy))/(3*node_height))*(Math.min(node_width,Math.abs(dx))/(node_width)) ;
                }
            }

            return `M${d.source.x + 120} ${d.source.y + 15} C ${d.source.x + 120 / 2 + scale * node_width} ${d.source.y + 15 + scaleY * node_height} ${d.target.x - scale * node_width} ${d.target.y + 15 - scaleY * node_height} ${d.target.x} ${d.target.y + 15}`;
          });
        console.log(data);
    }
    
}

class Foobar{
  name = 'a';
  x = 20;
  y = 20;
  color = 'black';

  constructor(obj) {
    Object.assign(this, obj);
  }
}