import React, {useRef} from 'react' //Allows to use Referances
import * as tf from '@tensorflow/tfjs'//Brings in Tensorflow
import * as handpose from '@tensorflow-models/handpose'//Brings in Handpose from Tfjs
import Webcam from 'react-webcam'//Brings in React's web cam
// import logo from './logo.svg';
import './App.css';

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const handsUp=async()=>{

    const hand=await handpose.load()
    console.log('====================================');
    console.log('Handpose is all set!!!!!');
    console.log('====================================');
    setInterval(() => {
      track(hand)
    }, 100)//Run after every 100msec
  }//Loading Tensorflow's Handpose  

  const track=async(hand)=>{

    if(typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4){
    
      const v=webcamRef.current.video
      const vH=webcamRef.current.video.videoHeight
      const vW=webcamRef.current.video.videoWidth//Grabbing video properties

      webcamRef.current.video.height=vH
      webcamRef.current.video.width=vW//Setting new properties

      canvasRef.current.height=vH
      canvasRef.current.width=vW
      
      const detect=await hand.estimateHands(v)
      console.log('====================================');
      console.log(detect);
      console.log('====================================');

    }

  }//Now let's detect our hand and it's position
  handsUp()

  return (
    <div className="App">
      <header className="App-header">
          <Webcam ref={webcamRef}
            style={{
              position:'absolute',
              margin:'auto',
              textAlign:'center',
              width:800,
              height:700
            }}
          />
          <canvas ref={canvasRef}
            style={{
              position:'absolute',
              margin:'auto',
              textAlign:'center',
              width:400,
              height:400
            }}
          />
          
      </header>
    </div>
  );
}

export default App;
