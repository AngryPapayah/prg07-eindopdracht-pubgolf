import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GAME_KEY = 'pubgolf_game';

const GameContext = createContext(null);

/**
 * @param {{ children: React.ReactNode }} props
 */
export function GameProvider({ children }) {
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(GAME_KEY).then((raw) => {
      if (raw) {
        const saved = JSON.parse(raw);
        setPlayers(saved.players || []);
        setScores(saved.scores || {});
        setGameActive(saved.gameActive || false);
      }
    });
  }, []);

  const persist = (p, s, active) => {
    AsyncStorage.setItem(GAME_KEY, JSON.stringify({ players: p, scores: s, gameActive: active }));
  };

  const startGame = (playerNames) => {
    const initialScores = {};
    playerNames.forEach((name) => {
      initialScores[name] = {};
    });
    setPlayers(playerNames);
    setScores(initialScores);
    setGameActive(true);
    persist(playerNames, initialScores, true);
  };

  const setScore = (playerName, holeId, sips) => {
    setScores((prev) => {
      const updated = { ...prev, [playerName]: { ...prev[playerName], [holeId]: sips } };
      persist(players, updated, gameActive);
      return updated;
    });
  };

  const resetGame = () => {
    setPlayers([]);
    setScores({});
    setGameActive(false);
    AsyncStorage.removeItem(GAME_KEY);
  };

  const getTotalScore = (playerName) => {
    const playerScores = scores[playerName] || {};
    return Object.values(playerScores).reduce((sum, s) => sum + s, 0);
  };

  return (
    <GameContext.Provider value={{ players, scores, gameActive, startGame, setScore, resetGame, getTotalScore }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
