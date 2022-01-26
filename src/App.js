import React, { useState, useRef } from "react";
//adding styles
import "./styles/app.scss";
//adding components
import Player from "./components/player";
import Song from "./components/song";
import Library from "./components/Library";
import Nav from "./components/Nav";
//adding data from util
import data from "./data";

function App() {
  //using ref to grab the HTML audio tag
  const audioRef = useRef(null);
  //State
  const [songs, setSongs] = useState(data());
  const [isPlaying, setIsPlaying] = useState(false);
  const [songInfo, setSongInfo] = useState({
    duration: 0,
    currentTime: 0,
    animationPecentage: 0,
    //here the already default values are there for duration and current time
  });

  //for the nav bar
  const [libraryStatus, setLibraryStatus] = useState(false);
  //we get the data from util file
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime;
    const duration = e.target.duration;
    // calculate percentage
    const roundedCurrent = Math.round(current);
    const roundedDuration = Math.round(duration);
    const animation = Math.round((roundedCurrent / roundedDuration) * 100);
    console.log(animation);

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration: duration,
      animationPecentage: animation,
    });

    //we add ... 3 dots to add the following things if already there is anything then add it also and not remove the previous one
  };
  //on ending the song skip to next one
  //so literally copy the whole code for skip part
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
    if (isPlaying) audioRef.current.play();
  };
  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        audioRef={audioRef}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setSongInfo={setSongInfo}
        songInfo={songInfo}
        songs={songs}
        setCurrentSong={setCurrentSong}
        setSongs={setSongs}
      />
      <Library
        audioRef={audioRef}
        setCurrentSong={setCurrentSong}
        songs={songs}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <audio
        onTimeUpdate={timeUpdateHandler}
        onLoadedMetadata={timeUpdateHandler}
        //this above event fetch the data on loading of data (this happens one when the audio file loads up)
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
