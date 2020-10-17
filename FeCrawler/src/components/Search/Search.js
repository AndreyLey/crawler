import React, {useState, useEffect}from 'react';
import { useForm} from "react-hook-form";
import CrawlerJobs from '../CrawlerJobs/CrawlerJobs';


function Search(props) {
  const { register, handleSubmit, errors } = useForm();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [jobLogs, setJobLog] = useState([]);

  useEffect(() => {

    props.socket.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    props.socket.onmessage = (message) => {
      console.log(message);
      setJobLog([...jobLogs, JSON.parse(message.data)]);
    };
  }, [jobLogs]);

  const sendSearchRequest = (toSend)=>{
    try{
      console.log(JSON.stringify(toSend));
      if (props.socket.readyState ===props.socket.CLOSING || props.socket.readyState === props.socket.CLOSED)
      {
        props.socket.onopen = () => {
          console.log('WebSocket Client Connected');
        };
      }     
      setTimeout(console.log("Timeout...."),1000);

      props.socket.send(JSON.stringify(toSend));

      console.log(`Sent message via socket`);
    }
    catch(error)
    {
      setIsLoaded(true);
      setError(error);
      console.log(error);
    }
  }

    return (<div>
        <form onSubmit={handleSubmit(sendSearchRequest)}>
          <label htmlFor='url'>Url to start:
                  <input type='text' id='url' name='url' ref={register({ required: true})}></input>
          </label>
          <label htmlFor='max_depth'>Max depth for searching :
                  <input type='text' id='max_depth' name='max_depth' ref={register({ required: true})}></input>
          </label>
          <label htmlFor='max_pages'>Max pages to search:
                  <input type='text' id='max_pages' name='max_pages' ref={register({ required: true})}></input>
          </label>
          <input type="submit" value="Search" /*disabled={submitDisable}*//>
      </form>

      <CrawlerJobs jobLogs={jobLogs}/>
      {/* <ul>
         {jobLogs.map((log,i)=>
          <li key={i}>{JSON.stringify(log.title)}</li>)}
      </ul> */}
    </div>
    );
}

export default Search;