import React, { Component } from 'react';
import { Text } from 'native-base';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Button } from 'react-native-elements';
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from 'react-native-sound';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      foo: false,
    }
  }

  prepareRecordingPath(fileName) {
    let audioPath = AudioUtils.DocumentDirectoryPath + '/' + fileName + ".aac";
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000,
      MeteringEnabled: true,
      });
  }

  async startRecording(fileName) {
    this.prepareRecordingPath(fileName);

    console.log("recording...", fileName)
    try {
      const filePath = await AudioRecorder.startRecording();
      } catch (error) {
        console.error(error);
      }
  }

  async stopRecording() {
    console.log("stopping the recording now.")
    try {
      const filePath = await AudioRecorder.stopRecording();
      } catch (error) {
        console.error(error);
      }
  }

  async play(filePath) {
    let fullPath = AudioUtils.DocumentDirectoryPath + "/" +filePath + ".aac";
    console.log("play path: ", fullPath)
    setTimeout(() => {
      var sound = new Sound(fullPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });

      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }, 100);
    }, 100);
  }

  editClipAndPlay() {
    RNFFmpeg.execute('-i ' + AudioUtils.DocumentDirectoryPath + "/hi.aac " + "-y -ss 5 -to 10 -c copy " + AudioUtils.DocumentDirectoryPath + "/short.aac")
    .then(result => console.log("ffmpeg process exited with rc "+ result.rc))
  }

  render() {
    return(
      <Grid>
        <Row size={8}>
          <Text style={{color: 'red', textAlign: 'center', fontSize: 48, flex: 1}}>Hello</Text>
        </Row>
        <Row size={1}>
          <Button
            large
            onPress={() => {this.startRecording("hi")}}
            title="Record"
            buttonStyle={{
              backgroundColor: 'red',
              width: 200,
              height: 100
              }}
            >
          </Button>
          <Button
            large
            onPress={() => {this.stopRecording()}}
            title="stop"
            buttonStyle={{
              backgroundColor: 'orange',
              width: 200,
              height: 100
              }}
            >
          </Button>
        </Row>
        <Row size={1}>
          <Button
            large
            onPress={() => {this.play("hi")}}
            title="Play"
            buttonStyle={{
              backgroundColor: 'green',
              width: 133,
              height: 100
              }}
            >
          </Button>
          <Button
            large
            onPress={() => {this.editClipAndPlay()}}
            title="Edit"
            buttonStyle={{
              backgroundColor: 'blue',
              width: 133,
              height: 100
              }}
            >
          </Button>
          <Button
            large
            onPress={() => {this.play("short")}}
            title="Play shorty"
            buttonStyle={{
              backgroundColor: 'pink',
              width: 133,
              height: 100
              }}
            >
          </Button>

        </Row>
      </Grid>
      );
  }

}
export default App;
