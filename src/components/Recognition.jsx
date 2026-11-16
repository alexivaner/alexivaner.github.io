import Icon from './Icon.jsx';
import { Localized } from '../i18n/I18n.jsx';
import React from 'react';
import data from '../../content/portfolio.json';

export default function Recognition() {
  const credential = data.certifications[0];
  return <Localized><div className="recognition-block"><div className="credential-and-photo"><a className="credential-link" href={credential.href} target="_blank" rel="noopener noreferrer"><h3>{credential.name}</h3><p>{credential.issuer} / {credential.type}</p><time dateTime={credential.dateTime}>Issued {credential.date}</time><span className="text-link">View certificate</span></a><div className="photography-intro"><h3>Photography, too.</h3><p>{data.photography.description}</p><a className="text-link" href={data.photography.href} target="_blank" rel="noopener noreferrer">{data.photography.handle} on Instagram</a></div></div><details className="recognition-details"><summary>Competition recognition<Icon name="plus" size={20} className="glyph"/></summary><div className="recognition-groups">{['Data science', 'Photography'].map(category => <div key={category}><h3>{category}</h3>{data.recognition.filter(item => item.category === category).map(item => <article key={item.title}><h4>{item.result}{item.detail && <> ({item.detail})</>}</h4><p>{item.title}</p><p className="recognition-meta">{item.issuer} / {item.date}</p>{item.association && <p className="recognition-meta">{item.association}</p>}{item.description && <p>{item.description}</p>}</article>)}</div>)}</div></details></div></Localized>;
}
