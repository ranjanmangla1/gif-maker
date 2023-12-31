import { useState, useEffect } from "react";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({log: true}) // log true shows everything it does, directly in console

function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();

  const [gif, setGif] = useState();
  
  const load = async() => {
    await ffmpeg.load();
    setReady(true);
  }

  useEffect(() => {
    load();
  }, [])

  const convertToGif = async() => {
    // writing the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(video));
    // it stays in the memory until the browser is refreshed

    // run the ffmpeg command
    await ffmpeg.run('-i', 'test.mp4', '-t', '2.5', '-ss', '2.0', '-f', 'gif', 'output.gif');

    // read the result
    const data = ffmpeg.FS('readFile', 'output.gif');

    // create a URL
    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif'}));
    setGif(url);
  }

  return ready ? (
    <div className="App">
      <p>Welcome to gif maker</p>
      {
        video 
        && 
          <video controls width="250" src={URL.createObjectURL(video)}></video>
      }
      <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />

      <button onClick={convertToGif}>Convert</button>      

      {
        gif &&
        <div>
          <h3>Result</h3>
          <img width="250" src={gif} />
        </div>
      }
    </div>
  ) :
  (<p>loading...</p>)
}

export default App
