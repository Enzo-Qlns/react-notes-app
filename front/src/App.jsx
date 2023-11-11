import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './views/Home';
import Utils from './utils/Utils';
import Http from './utils/Http';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

export default function App() {
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

  const update_note = (index, title, updated, content, funcAs200, funcAsErr) => {
    Http.request_update_note(index, title, updated, content, (statusCode, jsonBody) => {
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

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
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
              <HomePage
                deleteNote={delete_note}
                getSpecificNote={get_specific_note}
                getNotes={get_notes}
                addNote={add_note}
                updateNote={update_note}
                getWeather={get_weather}
              />
            }
          >
            <Route
              path=":noteId"
              element={
                <HomePage
                  deleteNote={delete_note}
                  getSpecificNote={get_specific_note}
                  getNotes={get_notes}
                  addNote={add_note}
                  updateNote={update_note}
                  getWeather={get_weather}
                />
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};