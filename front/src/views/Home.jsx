import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Divider, IconButton, Typography } from '@mui/material';
import DateManager from '../utils/DateManager';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useParams } from 'react-router-dom';
import Utils from '../utils/Utils';
import Note from '../components/Note';
import Fade from '@mui/material/Fade';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import PlaceIcon from '@mui/icons-material/Place';

export default function Home({ getNotes, updateNote, addNote, getSpecificNote, deleteNote, getWeather, getState }) {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userInfo, setUserInfo] = useState({
        temp: null,
        state: null,
    });
    // const [isFirst]
    const navigate = useNavigate();
    const params = useParams();
    const paramsNoteId = Number.parseInt(params.noteId) || 1;
    const [isInitialRequest200, setIsInitialRequest200] = useState(false);

    // Fonction pour afficher la note cliquée
    const handleClickNote = (index) => {
        navigate('/notes/' + (index));
        if (!Utils.isEmpty(getSpecificNote)) {
            getSpecificNote(index, (res) => {
                const updatedNote = notes.map((elt) => {
                    if (elt.id === index) {
                        return res;
                    }
                    return elt;
                });
                setNotes(updatedNote);
                setCurrentNote(res);
            });
        };
    };

    // Fonction pour modifier une note 
    const handleChangeUpdateNote = (title, content) => {
        if (!Utils.isEmpty(updateNote, addNote)) {
            if (Utils.isEmpty(notes)) {
                addNote(title, new Date(), content, (resNote) => {
                    setCurrentNote(resNote);
                    getNotes((resNotes) => {
                        setNotes(resNotes.reverse());
                    });
                });
            } else {
                updateNote(paramsNoteId, title.toString(), new Date(), content.toString(), (res) => {
                    const updatedNote = notes.map((elt) => {
                        if (elt.id === paramsNoteId) {
                            return res;
                        }
                        return elt;
                    });
                    setIsSaving(true);
                    setNotes(updatedNote);
                    setCurrentNote(res);
                    setTimeout(() => {
                        setIsSaving(false);
                    }, 1000);
                });
            };
        };
    };

    // Fonction pour ajouter une note 
    const handleClickAddNote = () => {
        if (!Utils.isEmpty(addNote)) {
            addNote("", new Date(), "", (resNote) => {
                setCurrentNote(resNote);
                getNotes((resNotes) => {
                    setNotes(resNotes.reverse());
                    navigate('/notes/' + (resNote.id));
                });
            });
        };
    };

    // Fonction pour supprimer une note
    const handleClickDeleteNote = (noteId) => {
        if (!Utils.isEmpty(deleteNote)) {
            deleteNote(noteId, () => {
                setNotes(notes.filter(a => a.id !== noteId));
                navigate('/notes/' + (paramsNoteId - 1));
            });
        };
    };

    // Requete initial pour récupérer les notes && vérifie si paramsNoteId dans url
    useEffect(() => {
        if (!Utils.isEmpty(getNotes, getWeather)) {
            // Récupère les notes
            getNotes((notes) => {
                if (Utils.isEmpty(notes)) {
                    let newObj = { "title": "", "content": "", "updated": new Date() };
                    setCurrentNote(newObj);
                } else {
                    let currentNote = notes.filter(elt => elt.id === paramsNoteId)[0];
                    setNotes(notes.reverse());
                    setCurrentNote(currentNote);
                    if (!Utils.isEmpty(notes) && Utils.isEmpty(params.noteId)) {
                        navigate('/notes/' + notes.length);
                    };
                };
            });
            // Récupère la ville et la météo de l'utilisateur
            Utils.getUserInfo().then((userInfo) => {
                getWeather(userInfo.latitude, userInfo.longitude, (res) => {
                    let temp = res.current.temp_c;
                    let state = res.location.name;
                    setUserInfo({ temp: temp, state: state });
                });
            });
        };
    }, []);

    return (
        <Box display={'flex'}>

            {/* LEFT BOX */}
            <Box
                sx={{
                    height: '100vh',
                    width: 250,
                    bgcolor: 'var(--grey)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRight: 'solid 1px grey',
                        borderRadius: '0.5rem 0',
                        p: 1,
                    }}
                >
                    <Typography variant='h5' textAlign={'center'}>
                        Vos Notes
                    </Typography>
                    <IconButton onClick={handleClickAddNote}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        height: '88%',
                        overflowY: 'auto',
                        borderRight: 'solid 1px grey',
                        borderTop: 'solid 1px grey',
                        borderRadius: '0 0.5rem 0 0',
                    }}
                >
                    {notes && (
                        notes.map((note, index) => (
                            <Card
                                key={index}
                                variant={paramsNoteId === note.id ? 'outlined' : 'elevation'}
                                sx={{
                                    mt: 2,
                                    cursor: paramsNoteId !== note.id && 'pointer',
                                    '&:hover': {
                                        bgcolor: paramsNoteId !== note.id && 'var(--grey)',
                                    },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => handleClickNote(note.id)}
                                    disabled={paramsNoteId === note.id}
                                >
                                    <CardContent>
                                        <Typography variant='h6' gutterBottom>
                                            {note.title}
                                        </Typography>
                                        <Typography color='text.secondary' fontSize={'11px'} variant='caption' gutterBottom>
                                            {DateManager.convertDate(note.updated)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                {paramsNoteId === note.id && (
                                    <CardActions onClick={() => handleClickDeleteNote(note.id)}>
                                        <Button size="small" color="primary">
                                            Supprimer
                                        </Button>
                                    </CardActions>)}
                            </Card>
                        )))}
                </Box>
                {(userInfo.temp !== null && userInfo.state !== null) && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            ml: 1,
                        }}
                    >
                        <PlaceIcon />
                        <Typography variant='subtitle1' mr={1}>{userInfo.state}</Typography>
                        <ThermostatIcon />
                        <Typography variant='subtitle1'>{userInfo.temp}°C</Typography>
                    </Box>)}
            </Box>
            {/* END LEFT BOX */}

            {/* RIGHT BOX */}
            <Box
                sx={{
                    width: '95%',
                    bgcolor: 'var(--grey)',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: (Utils.objSize(notes) === 0 || Utils.isEmpty(currentNote)) && 'center',
                }}
            >
                {Utils.objSize(currentNote) !== 0 && (
                    <>
                        <Note
                            onChangeNote={handleChangeUpdateNote}
                            currentNote={currentNote}
                        />
                        {isSaving && (
                            <Fade in={isSaving}>
                                <Typography variant='body1' sx={{ mx: 3 }}>Enregistré !</Typography>
                            </Fade>)}

                    </>)}
            </Box>
            {/* END RIGHT BOX */}

        </Box >
    );
};