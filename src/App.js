/* eslint-disable */

import React, { Component } from 'react';
import './App.css';
import { Transcript } from './styled'

class App extends Component {

  state = {
    recognition: null,
    transcripts: [],
    indexCounter: 0
  }

  componentDidMount = () => {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.interimResults = true
    recognition.lang = 'en-AU';

    this.setState({recognition})
  }

  startRecognition = () => {
    const { recognition } = this.state

    recognition.addEventListener('result', e => {
      const currentTranscript = Array.from(e.results)
        .map(result => {
          if(result.isFinal) return result[0]
        })
        .map(result => {
          if(result && result.confidence > 0.70 ) return result.transcript
        })
        .join('')

      const transcripts = [...this.state.transcripts, currentTranscript]
      this.setState({transcripts})
    })

    recognition.start()
    recognition.onspeechend = () => this.setState(prevState => ({ indexCounter: prevState.indexCounter + 1 }))
    recognition.addEventListener('end', recognition.start)
  }

  stopRecognition = () => {
    const { recognition } = this.state

    recognition.abort()
  }


  render() {
    const { recognition, transcripts, indexCounter } = this.state 

    return (
      <div className="App">
        { recognition && <button onClick={this.startRecognition}> Start Speech SpeechRecognition</button>}
        <Transcript> 
          { transcripts.map((transcript, index) => <p key={index}>{transcript}</p>) }
        </Transcript>
      </div>
    );
  }
}

export default App;
