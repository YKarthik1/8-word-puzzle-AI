
const MAX_DFS_DEPTH=25;

function createGrid(name){

let grid=document.getElementById(name+"-grid");

for(let i=0;i<9;i++){

let inp=document.createElement("input");

inp.maxLength=1;

inp.oninput=updateViz;

grid.appendChild(inp);

}

}

function getState(name){

let nums=[...document.querySelectorAll("#"+name+"-grid input")]
.map(i=>Number(i.value)||0);

return[

nums.slice(0,3),

nums.slice(3,6),

nums.slice(6,9)

];

}

function setState(name,state){

let flat=state.flat();

document.querySelectorAll("#"+name+"-grid input")

.forEach((el,i)=>el.value=flat[i]);

updateViz();

}

function clearGrid(name){

document.querySelectorAll("#"+name+"-grid input")
.forEach(i=>i.value="");

updateViz();

}

function clearAll(){

clearGrid("initial");

clearGrid("goal");

document.getElementById("results").innerHTML=

"Time:-<br>Nodes Expanded:-<br>Path Cost:-";

}

function loadInitial(){

setState("initial",[[1,2,3],[8,0,4],[7,6,5]]);

}

function loadGoal(){

setState("goal",[[2,8,1],[0,4,3],[7,6,5]]);

}

function updateViz(){

draw(getState("initial"));

}

function draw(state){

let viz=document.getElementById("viz-grid");

viz.innerHTML="";

state.flat().forEach(v=>{

let d=document.createElement("div");

d.className="tile";

d.innerText=v||"";

viz.appendChild(d);

});

}

function stringify(s){return JSON.stringify(s)}

function neighbors(s){

let x,y;

for(let i=0;i<3;i++)
for(let j=0;j<3;j++)
if(s[i][j]==0){x=i;y=j}

let dirs=[[1,0],[-1,0],[0,1],[0,-1]];

let res=[];

for(let d of dirs){

let nx=x+d[0];

let ny=y+d[1];

if(nx>=0&&ny>=0&&nx<3&&ny<3){

let c=JSON.parse(JSON.stringify(s));

[c[x][y],c[nx][ny]]=[c[nx][ny],c[x][y]];

res.push(c);

}

}

return res;

}

function manhattan(a,b){

let dist=0;

for(let i=0;i<3;i++)
for(let j=0;j<3;j++){

let val=a[i][j];

if(val){

for(let x=0;x<3;x++)
for(let y=0;y<3;y++)

if(b[x][y]==val)

dist+=Math.abs(i-x)+Math.abs(j-y);

}

}

return dist;

}

function bfs(start,goal){

let q=[[start,[]]];

let vis=new Set();

let nodes=0;

while(q.length){

let[s,p]=q.shift();

let k=stringify(s);

if(vis.has(k))continue;

vis.add(k);

nodes++;

if(k==stringify(goal))

return{path:[...p,s],nodes};

for(let n of neighbors(s))

q.push([n,[...p,s]]);

}

}

function dfs(start,goal){

let st=[[start,[],0]];

let vis=new Set();

let nodes=0;

while(st.length){

let[s,p,d]=st.pop();

let k=stringify(s);

if(vis.has(k))continue;

vis.add(k);

nodes++;

if(k==stringify(goal))

return{path:[...p,s],nodes};

if(d<MAX_DFS_DEPTH)

for(let n of neighbors(s))

st.push([n,[...p,s],d+1]);

}

}

function astar(start,goal){

let open=[[start,[],0]];

let vis=new Set();

let nodes=0;

while(open.length){

open.sort((a,b)=>a[2]-b[2]);

let[s,p,c]=open.shift();

let k=stringify(s);

if(vis.has(k))continue;

vis.add(k);

nodes++;

if(k==stringify(goal))

return{path:[...p,s],nodes};

for(let n of neighbors(s)){

let g=p.length+1;

open.push([n,[...p,s],g+manhattan(n,goal)]);

}

}

}

function solve(){

let start=getState("initial");

let goal=getState("goal");

let algo=document.querySelector("input[name='algo']:checked").value;

let t0=performance.now();

let result=algo=="bfs"?bfs(start,goal):

algo=="dfs"?dfs(start,goal):

astar(start,goal);

let time=(performance.now()-t0)/1000;

animate(result.path);

document.getElementById("results").innerHTML=

"Time: "+time.toFixed(3)+" s<br>"+

"Nodes Expanded: "+result.nodes+"<br>"+

"Path Cost: "+(result.path.length-1);

}

function animate(path){

let i=0;

let timer=setInterval(()=>{

draw(path[i]);

i++;

if(i>=path.length)clearInterval(timer);

},400);

}

createGrid("initial");

createGrid("goal");

createGrid("viz");

loadInitial();

loadGoal();
