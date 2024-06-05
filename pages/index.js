// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [tapPower, setTapPower] = useState(1);
  const [autoRate, setAutoRate] = useState(0);
  const [upgrades, setUpgrades] = useState(getDefaultUpgrades());

  useEffect(() => {
    const savedBalance = Number.parseInt(localStorage.getItem('balance'), 10) || 0;
    const savedTapPower = Number.parseInt(localStorage.getItem('tapPower'), 10) || 1;
    const savedUpgrades = JSON.parse(localStorage.getItem('upgrades')) || getDefaultUpgrades();
    setBalance(savedBalance);
    setTapPower(savedTapPower);
    setUpgrades(savedUpgrades);
    setAutoRate(calculateAutoRate(savedUpgrades));

    // Проверка и использование TonProvider
    try {
      const TonProvider = require('ton-provider'); // или другой способ импорта
      const provider = new TonProvider();

      if (provider && typeof provider.on === 'function' && provider.on('chainChanged')) {
        provider.on('chainChanged', (chainId) => {
          console.log('Chain changed to', chainId);
        });
      } else {
        console.warn('Provider does not support chainChanged');
      }
    } catch (error) {
      console.error('Error with TonProvider:', error);
    }
  }, []);

  const handleTap = () => {
    const newBalance = balance + tapPower;
    setBalance(newBalance);
    localStorage.setItem('balance', newBalance);
    // Save data to API
  };

  const getDefaultUpgrades = () => {
    return {
      CLICK_MULTIPLIER: { displayName: "Click", description: "Multiply per click", baseMultiplier: 1, level: 0, cost: 50, costIncrement: 1.15, maxLevel: 10 },
      AUTOCLICK: { displayName: "Auto-Click", description: "Automatically clicks", baseMultiplier: 1, level: 0, cost: 300, costIncrement: 1.15, maxLevel: 10 },
      VOYAGER: { displayName: "Voyager", description: "Automatically clicks more", baseMultiplier: 2, level: 0, cost: 500, costIncrement: 1.15, maxLevel: 10 },
      ROVER: { displayName: "Rover", description: "Multiply all resources", baseMultiplier: 5, level: 0, cost: 1000, costIncrement: 1.15, maxLevel: 10 },
      DELIVERY: { displayName: "Delivery", description: "Multiply all resources", baseMultiplier: 10, level: 0, cost: 5000, costIncrement: 1.15, maxLevel: 10 },
      NEW_PLANET: { displayName: "New Planet", description: "Double all resources to collect", baseMultiplier: 20, level: 0, cost: 10000, costIncrement: 1.15, maxLevel: 10 }
    };
  };

  const calculateAutoRate = (upgrades) => {
    let autoRate = 0;
    for (const upgrade of Object.values(upgrades)) {
      autoRate += upgrade.baseMultiplier * upgrade.level;
    }
    return autoRate;
  };

  return (
    <div>
      <Head>
        <title>Tap Game</title>
        <link rel="stylesheet" href="styles.css" />
      </Head>
      <div className="game-window" id="main-page">
        <div className="top-bar">
          <span>Balance: <span id="balance-value">{balance}</span></span>
          <span className="game-message">Tap the planet to earn points!</span>
        </div>
        <div className="game-screen">
          <div className="cookie-container">
            <div className="cookie" id="tap-button" onClick={handleTap}>
              <img src="https://raw.githubusercontent.com/JdyL/img-host/eb12be794f4871f010a76e82211fbdff4c8dea00/svg/space-clicker/cookie.svg" alt="planet" />
            </div>
            <div className="click-effect-container" id="click-effects">
            </div>
          </div>
          <div className="stars">
            <img src="https://raw.githubusercontent.com/JdyL/img-host/25e95e7b28baed293f29217d803ed09b90fc96c1/svg/space-clicker/stars.svg" alt="stars" />
          </div>
        </div>
        <div className="navigation">
          <button className="nav-button" onClick={() => navigateTo('profile')}>Profile</button>
          <button className="nav-button" onClick={() => navigateTo('store')}>Store</button>
          <button className="nav-button" onClick={() => navigateTo('partners')}>Partners</button>
          <button className="nav-button" onClick={() => navigateTo('entertainment')}>Entertainment</button>
          <button className="nav-button" onClick={() => navigateTo('property')}>Property</button>
        </div>
      </div>
      {/* Add other game windows here similar to the structure in your HTML file */}
    </div>
  );
}
