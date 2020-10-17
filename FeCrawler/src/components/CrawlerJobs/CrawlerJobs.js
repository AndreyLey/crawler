import React, { Component } from 'react';

function CrawlerJobs(props){
  
  return (<div><h2>Jobs Log:</h2>
              <table id="leftText">
                <tbody>
                  <tr>
                  <th>Root Url</th>
                  <th>Url</th>
                  <th>Title</th>
                  <th>Depth</th>
                  <th>Links</th>
                  <th>Status</th>
                  </tr>
                
                  {props.jobLogs.map((job,i)=>
                    <tr key={i}>
                      <td>{job.root}</td>
                      <td>{job.url}</td>
                      <td>{job.title}</td>
                      <td>{job.depth}</td>
                      <td>{job.linksCount}</td>
                      <th>{job.status}</th>

                    </tr>)}

                </tbody>
              </table>
  </div>);
  
}

export default CrawlerJobs;
