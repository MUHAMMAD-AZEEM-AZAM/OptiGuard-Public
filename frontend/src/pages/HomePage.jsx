import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../theme/AppTheme';
import ImageUploadCard from '../components/ImageUploadCard';
import Hero from '../components/Hero';
import FAQ from '../components/FAQ';
import { useState, useEffect } from 'react';
import ResultCard from '../components/ResultCard';
import { useTheme } from '@mui/material/styles';
import bg from '../../public/bg.png';

// use react-particles directly
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export default function HomePage(props) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const storedResults = sessionStorage.getItem('results');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  useEffect(() => {
    if (results && results.length > 0) {
      sessionStorage.setItem("results", JSON.stringify(results));
    }
  }, [results]);

  const particlesInit = async (engine) => {
    await loadSlim(engine);
  };

  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />

      {/* Particles */}
      <div style={{ position: 'fixed', width: '100%', height: '100%', zIndex: 0 }}>
        <Particles
          id="particles-js"
          init={particlesInit}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 60,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: true,
              },
            },
            particles: {
              color: {
                value: isDarkMode ? "#026bd4" : "#555", // <-- different color in light
              },
              links: {
                color: isDarkMode ? "#939598" : "#aaa", // <-- different link color in light
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                directions: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                speed: 1,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 40,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 4 },
              },
            },
            detectRetina: true,
          }}
        />
      </div>

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        {/* <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex:'-1'
          }}
        ></div> */}
        <Hero />
        <ImageUploadCard onUploadComplete={setResults} />
        <ResultCard results={results} setResults={setResults} />
        <FAQ />
      </div>
    </AppTheme>
  );
}
