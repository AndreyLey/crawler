import React, { Component } from 'react';

function CrawlerJobs(props){
  
  return (<div><h2>Jobs Log:</h2>
              <table id="leftText">
                <tbody>
                  <tr>
                    <th>Title</th>
                  </tr>
                
                  {props.jobLogs.map((job,i)=>
                    <tr key={i}>
                      <td>{job}</td>
                    </tr>)}

                </tbody>
              </table>
  </div>);
  
}

export default CrawlerJobs;
