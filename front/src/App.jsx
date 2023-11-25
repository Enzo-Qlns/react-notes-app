import React, { useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './views/Home';
import Utils from './utils/Utils';
import Http from './utils/Http';
import SwitchThemeMode from './components/SwitchThemeMode';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './views/animations.css';

/**
 * @callback funcAs200Callback
 * @param {String} jsonBody
*/

/**
 * @callback funcAsErrCallback
 * @param {Number} statusCode
 * @param {String} jsonBody
*/

export default function App() {
  const [theme, setTheme] = useState('dark');

  /**
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const get_notes = (funcAs200, funcAsErr) => {
    Http.request_get_notes((statusCode, jsonBody) => {
      if (statusCode === 200) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      }
    });
  };

  /**
   * @param {Number} index 
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const get_specific_note = (index, funcAs200, funcAsErr) => {
    Http.request_get_specific_note(index, (statusCode, jsonBody) => {
      if (statusCode === 200) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      }
    });
  };

  /**
   * @param {String} title 
   * @param {String} content 
   * @param {Date} updated 
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const add_note = (title, updated, content, funcAs200, funcAsErr) => {
    Http.request_add_note(title, updated, content, (statusCode, jsonBody) => {
      if (statusCode === 200 || statusCode === 201) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      }
    });
  };

  /**
   * @param {Number} index 
   * @param {String} title 
   * @param {String} content 
   * @param {Boolean} pin 
   * @param {Date} updated 
   * @param {Date} created 
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const update_note = (index, title, content, pin, updated, createdAt, funcAs200, funcAsErr) => {
    Http.request_update_note(index, title, content, pin, updated, createdAt, (statusCode, jsonBody) => {
      if (statusCode === 200) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      }
    });
  };

  /**
   * @param {Number} index
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const delete_note = (index, funcAs200, funcAsErr) => {
    Http.request_delete_note(index, (statusCode, jsonBody) => {
      if (statusCode === 200) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      }
    });
  };

  /**
   * @param {Number} lat 
   * @param {Number} long 
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const get_weather = (lat, long, funcAs200, funcAsErr) => {
    Http.request_get_weather(lat, long, (statusCode, jsonBody) => {
      if (statusCode === 200) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      };
    });
  };

  /**
   * @param {funcAs200Callback} funcAs200 
   * @param {funcAsErrCallback} funcAsErr 
  */
  const get_profile = (funcAs200, funcAsErr) => {
    Http.request_get_profile((statusCode, jsonBody) => {
      if (statusCode === 200) {
        if (!Utils.isEmpty(funcAs200)) {
          funcAs200(jsonBody);
        }
      } else {
        if (!Utils.isEmpty(funcAsErr)) {
          funcAsErr(jsonBody, statusCode);
        }
      };
    });
  };

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: 'var(--grey-dark)',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/notes" />} />
          <Route
            path="/notes"
            element={
              <Home
                getNotes={get_notes}
                addNote={add_note}
              />
            }
          />
          <Route
            path="/notes/:noteId"
            element={
              <Home
                deleteNote={delete_note}
                getNotes={get_notes}
                addNote={add_note}
                updateNote={update_note}
                getWeather={get_weather}
                getProfile={get_profile}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>

      <SwitchThemeMode onCheck={(a) => { a ? setTheme('dark') : setTheme('light') }} />
      <ToastContainer theme='dark' />
    </ThemeProvider>
  );
};