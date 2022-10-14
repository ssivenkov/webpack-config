import Post from "@models/Post";
import './styles/styles.css';
import json from './assets/json';
import WebpackLogo from './assets/webpack-logo';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import {nanoid} from "nanoid";
import './styles/less.less';
import './styles/scss.scss';
import './babel';
import React from 'react';
import {render} from 'react-dom';

const post = new Post('webpack post title', WebpackLogo);

console.log('Post to string:', post.toString())
console.log('json title -', json.title);
console.log('xml -', xml);
console.log('csv -', csv);
console.log(nanoid());

const App = () => (
  <div className="container">
    <h1>Webpack config</h1>
    <hr/>
    <div className="logo"/>
    <hr/>
    <span className="code">Code</span>
    <hr/>
    <div className="box">
      <h2>Less</h2>
    </div>
    <hr/>
    <div className="card">
      <h2>SCSS</h2>
    </div>
  </div>
);

render(<App/>, document.getElementById('app'));