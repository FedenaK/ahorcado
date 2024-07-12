import { useEffect, useState } from 'react';
import { HangImage } from './components/HangImage';
import { letters } from './helpers/letters';

import Button from 'react-bootstrap/Button';

import './App.css';

const removeAccents = (word: string): string => {
  return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getRandomWordFromAPI = async () => {
  try {
    const response = await fetch('https://clientes.api.greenborn.com.ar/public-random-word?c=1');
    const data = await response.json();
    return data[0]; // Ajusta según la estructura de la respuesta
  } catch (error) {
    console.error('Error fetching the word:', error);
    return null;
  }
};

function App() {
  const [word, setWord] = useState<string | null>(null);
  const [hiddenWord, setHiddenWord] = useState<string>('');
  const [attempts, setAttempts] = useState(0);
  const [lose, setLose] = useState(false);
  const [won, setWon] = useState(false);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);




  useEffect(() => {
    const fetchWord = async () => {
      const randomWord = await getRandomWordFromAPI();
      if (randomWord) {
        const normalizedWord = removeAccents(randomWord.toUpperCase());
        setWord(normalizedWord);
        setHiddenWord('_ '.repeat(randomWord.length));
      }
    };
    fetchWord();
  }, []);

  // Determinar si la persona perdió
  useEffect(() => {
    if (attempts >= 9) {
      setLose(true);
    }
  }, [attempts]);

  // Determinar si la persona ganó
  useEffect(() => {
    if (word && hiddenWord.split(' ').join('') === word) {
      setWon(true);
    }
  }, [hiddenWord, word]);

  // Manejar eventos del teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const letter = event.key.toUpperCase();
      if (/[A-Z]/.test(letter) && letter.length === 1) {
        checkLetter(letter);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [lose, won, word, hiddenWord, attempts, guessedLetters]);

  const checkLetter = (letter: string) => {
    if (lose || won || guessedLetters.includes(letter) || !word) return;

    setGuessedLetters([...guessedLetters, letter]);

    if (!word.includes(letter)) {
      setAttempts(Math.min(attempts + 1, 9));
      return;
    }

    const hiddenWordArray = hiddenWord.split(' ');

    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        hiddenWordArray[i] = letter;
      }
    }

    setHiddenWord(hiddenWordArray.join(' '));
  };

  const newGame = async () => {
    const newWord = await getRandomWordFromAPI();
    if (newWord) {
      setWord(newWord.toUpperCase());
      setHiddenWord('_ '.repeat(newWord.length));
      setAttempts(0);
      setLose(false);
      setWon(false);
      setGuessedLetters([]);
    }
  };

  return (
    <div className='App'>

      <h1>El Ahorcado</h1>

      <HangImage imageNumber={attempts} />

      <h3>{hiddenWord}</h3>

      <h4>Intentos: {attempts}</h4>

      {lose ? <h2>Perdiste! La palabra era {word}.</h2> : ''}
      {won ? <h2>Que crack. ¡Ganaste la partida!</h2> : ''}
      
      {letters.map((letter) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => checkLetter(letter)}
          key={letter}
          disabled={guessedLetters.includes(letter)}
        >
          {letter}
        </Button>
      ))}
      <br /><br />
      <Button id="reintentar" variant="outline-danger" size="lg" onClick={newGame}>
      {lose ? 'Reintentar' : won ? '¿Otra?' : 'Cambiar palabra'}
      </Button>
    </div>
  );
}

export default App;