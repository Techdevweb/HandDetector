import React, {useRef,useState} from 'react' //Allows to use Referances
import * as tf from '@tensorflow/tfjs'//Brings in Tensorflow
import * as handpose from '@tensorflow-models/handpose'//Brings in Handpose from Tfjs
import Webcam from 'react-webcam'//Brings in React's web cam
import * as fp from 'fingerpose'//Key for detecting our hand gestures
import './App.css';



function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const drawing=(pred,canv)=>{

    if(pred.length >0){
      //Check whether array is empty or not
      pred.forEach((pred) => {
        //For each and every non empty array
        const cord=pred.landmarks//Grab all the co-ordinates
  
        //Now let's go through each co-ordinate
        for (let index = 0; index < cord.length; index++) {
          const x=cord[index][0]
          console.log(x)
  
          const y=cord[index][1]
          console.log(y)
  
          //Let's draw
          canv.beginPath()
          canv.arc(x,y,4,0,3*Math.PI)
          canv.fillStyle='red'
          canv.fill()
          
        }
      });
  
    }
  }

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

      //Let's detect our gestures
      if (detect.length>0) {
        const GE = new fp.GestureEstimator([//Setting up gesture estimator
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture
      ])
      const gesture=await GE.estimate(detect[0].landmarks,8)//Confidence lvl is 8
      
      console.log('====================================');
      console.log(gesture)//Check consol
      console.log('====================================');
      }

      const canv=canvasRef.current.getContext('2d')
      drawing(detect, canv)

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
              width:900,
              height:800
            }}
          />
          <canvas ref={canvasRef}
            style={{
              position:'absolute',
              margin:'auto',
              textAlign:'center',
              width:900,
              height:800
            }}
          />
          
      </header>
    </div>
  );
}

export default App;
