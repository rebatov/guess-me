import React, { useState, useEffect, useRef } from 'react';
import './App.css';
// const successSound = require('./audios/success.mp3');
// const failureSound = require('./audios/0.mp3');
// const oneSound = require('./audios/1.mp3');
// const twoSound = require('./audios/2.mp3');
// const threeSound = require('./audios/3.mp3');

function App(): JSX.Element {
  const [inputs, setInputs] = useState<string[]>(['', '', '', '']);
  const [success, setSuccess] = useState<boolean>(false);
  const [pastNumbers, setPastNumbers] = useState<{ number: string; correctDigits: number }[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [combination, setCombination] = useState<string>('');
  const [combinationGenerated, setCombinationGenerated] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>(Array.from({ length: 5 }, () => null));

  useEffect(() => {
    const storedNumbers = localStorage.getItem('pastNumbers');
    if (storedNumbers) {
      setPastNumbers(JSON.parse(storedNumbers));
    }
    if (!combinationGenerated) {
      generateCombination();
      setCombinationGenerated(true);
    }
  }, [combinationGenerated]);

  useEffect(() => {
    localStorage.setItem('pastNumbers', JSON.stringify(pastNumbers));
  }, [pastNumbers]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const generateCombination = () => {
    let randomCombination = '';
    for (let i = 0; i < 4; i++) {
      randomCombination += Math.floor(Math.random() * 10).toString();
    }
    console.log(randomCombination);
    setCombination(randomCombination);
  };

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);

    if (value !== '' && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    submitForm();
  };

  const handleKeyPress = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitForm();
    }
  };

  const submitForm = () => {
    let correctDigits = 0;
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i] === combination[i]) {
        correctDigits++;
      }
    }
    setTotalSubmissions(totalSubmissions + 1);
    if (correctDigits === combination.length) {
      setSuccess(true);
      playSuccessSound();
    } else {
      alert('Incorrect combination!');
    }
    setPastNumbers([...pastNumbers, { number: inputs.join(''), correctDigits }]);
  };


  const playSuccessSound = () => {
    if (audioRefs.current && audioRefs.current.length > 0) {
      console.log("Playing sound...");
      audioRefs.current.forEach(audio => {
        if (audio) {
          audio.play()
            .then(() => console.log("Sound played successfully"))
            .catch((error: any) => console.error("Error playing sound:", error)); // Explicitly define the type for the error parameter
        }
      });
    } else {
      console.error("Audio elements not found");
    }
  };

  const resetInputs = () => {
    setInputs(['', '', '', '']);
    setSuccess(false);
    setPastNumbers([]);
    setCombinationGenerated(false);
  };

  return (
    <div className="App">
      {audioRefs.current.map((audio, index) => (
        <audio key={index} ref={(el) => (audioRefs.current[index] = el)}>
          <source src={`./audios/${index}.mp3`} type="audio/mpeg" />
        </audio>
      ))}
      <div className="container">
        {pastNumbers.length > 0 && (
          <div className="leftPanel">
            <h2>Past Entered Numbers</h2>
            <ul>
              {pastNumbers.map((item, index) => (
                <li key={index}>
                  {item.number} - {item.correctDigits} correct digits
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="rightPanel">
          <header className="App-header">
            {!success ? (
              <div>
                <h1>Enter the Combination</h1>
                <div>
                  {inputs.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      value={value}
                      ref={(el) => (inputRefs.current[index] = el)}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(index, e)}
                    />
                  ))}
                </div>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            ) : (
              <div>
                <h1>Success!</h1>
                <p>You entered: {inputs.join('')}</p>
                <p>Total submissions before success: {totalSubmissions}</p>
                <button onClick={resetInputs}>Try Again</button>
              </div>
            )}
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;
