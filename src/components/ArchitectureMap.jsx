import React,{useId,useState} from 'react';

export default function ArchitectureMap({diagram}){
 const [active,setActive]=useState(()=>Math.max(0,diagram.nodes.findIndex(node=>node.core))),marker=useId().replaceAll(':',''),nodes=diagram.nodes,node=nodes[active],edges=diagram.edges||[],structured=nodes.every(item=>Array.isArray(item.position));
 const byId=new Map(nodes.map(item=>[item.id,item]));
 const related=edges.filter(edge=>edge.from===node.id||edge.to===node.id);
 function keys(event){if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;const buttons=[...event.currentTarget.querySelectorAll('button')],i=buttons.indexOf(event.target);if(i<0)return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?nodes.length-1:(i+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+nodes.length)%nodes.length;setActive(next);buttons[next].focus();}
 function path(edge){const a=byId.get(edge.from),b=byId.get(edge.to);if(!a?.position||!b?.position)return '';const x1=a.position[0]*10,y1=a.position[1]*6.4,x2=b.position[0]*10,y2=b.position[1]*6.4,dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy);if(length<1)return '';const clearance=Math.min(112/(Math.abs(dx)/length||1e-6),58/(Math.abs(dy)/length||1e-6));const start=Math.min(clearance+6,length*.46),end=Math.min(clearance+12,length*.46);return `M${x1+dx/length*start},${y1+dy/length*start} L${x2-dx/length*end},${y2-dy/length*end}`;}
 return <section className="architecture-study" aria-label={diagram.title}>
  <p className="architecture-intro">{diagram.description}</p>
  <div className="architecture-workspace">
   <div className="architecture-choices architecture-map" role="group" aria-label={diagram.title} data-structured={structured} onKeyDown={keys}>
    {structured&&<svg className="architecture-connections" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true"><defs>{['idle','active'].map(state=><marker key={state} id={`${marker}-${state}`} className={`architecture-marker-${state}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z"/></marker>)}</defs><polygon className="architecture-boundary" points="500,45 750,170 750,460 500,595 250,460 250,170"/>{edges.map((edge,i)=><path key={i} d={path(edge)} markerEnd={`url(#${marker}-${related.includes(edge)?'active':'idle'})`} className={`architecture-edge ${edge.kind==='wiring'?'architecture-wiring':''} ${related.includes(edge)?'is-related':''}`}/>)}</svg>}
    {nodes.map((item,i)=><button key={item.id} type="button" className={item.core?'architecture-node architecture-domain':'architecture-node'} style={{'--node-x':`${(item.position?.[0]??50)}%`,'--node-y':`${(item.position?.[1]??50)}%`}} aria-pressed={active===i} onClick={()=>setActive(i)}><span className="architecture-node-layer">{item.layer}</span><span>{item.title}</span></button>)}
   </div>
   <div className="architecture-explanation" aria-live="polite"><h4>{node.title}</h4><p>{node.text}</p>{node.example&&<p className="architecture-example">{node.example}</p>}<ul className="architecture-relations">{related.map((edge,i)=><li key={i}><span>{byId.get(edge.from)?.title}<span className="architecture-relation-arrow" aria-hidden="true">→</span>{byId.get(edge.to)?.title}</span><span>{edge.label}</span></li>)}</ul><code>{node.evidence}</code></div>
  </div>
  <p className="architecture-legend">{diagram.legend}</p>
 </section>;
}
