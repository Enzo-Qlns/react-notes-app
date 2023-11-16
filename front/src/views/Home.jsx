import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, IconButton, Skeleton, Typography } from '@mui/material';
import Fade from '@mui/material/Fade';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import PlaceIcon from '@mui/icons-material/Place';
import DateManager from '../utils/DateManager';
import Utils from '../utils/Utils';
import Note from '../components/Note';

export default function Home({ getNotes, updateNote, addNote, getSpecificNote, deleteNote, getWeather }) {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [userInfo, setUserInfo] = useState({
        temp: null,
        state: null,
        isAccept: false
    });
    const navigate = useNavigate();
    const params = useParams();
    const paramsNoteId = Number.parseInt(params.noteId) || 1;

    /**
     * Fonction pour afficher la note cliquée
     * @param {Number} index 
    */
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

    /**
     * Fonction pour modifier une note 
     * @param {String} title 
     * @param {String} content 
    */
    const handleChangeUpdateNote = (title, content) => {
        if (!Utils.isEmpty(updateNote, addNote)) {
            if (Utils.isEmpty(notes)) {
                addNote(title, new Date(), content, (resNote) => {
                    setCurrentNote(resNote);
                    setNotes(current => [resNote, ...current]);
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

    /**
     * Fonction pour ajouter une note 
    */
    const handleClickAddNote = () => {
        if (!Utils.isEmpty(addNote)) {
            addNote("", new Date(), "", (resNote) => {
                setCurrentNote(resNote);
                setNotes(current => [resNote, ...current]);
                navigate('/notes/' + (resNote.id));
            });
        };
    };

    /**
     * Fonction pour supprimer une note
     * @param {Number} noteId 
    */
    const handleClickDeleteNote = (noteId) => {
        if (!Utils.isEmpty(deleteNote)) {
            deleteNote(noteId, () => {
                let updatedNotes = notes.filter(a => a.id !== noteId);
                setNotes(updatedNotes);
                setCurrentNote(updatedNotes[0]);
                navigate('/notes/' + (paramsNoteId - 1));
            });
        };
    };

    /**
     * Requête initiale pour récupérer les notes && vérifie si paramsNoteId dans url
    */
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
                    if (!Utils.isEmpty(notes) && Utils.isEmpty(params.noteId)) {
                        setCurrentNote(notes[0]);
                        navigate('/notes/' + notes[0].id);
                    } else {
                        setCurrentNote(currentNote);
                    };
                };
            });
            // Récupère la ville et la météo de l'utilisateur
            Utils.getUserInfo().then((userInfo) => {
                getWeather(userInfo.latitude, userInfo.longitude, (res) => {
                    let temp = res.current.temp_c;
                    let state = res.location.name;
                    setUserInfo({ temp: temp, state: state, isAccept: true });
                });
            }, () => {
                setUserInfo({ isAccept: false });
            });
        };
    }, []);

    return (
        <Box display={'flex'} height={'100vh'}>

            {/* LEFT BOX */}
            <Box
                sx={{
                    width: 250,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
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
                    {!Utils.isEmpty(notes) && (
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
                                className='fade-in'
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
                        ))
                    )}
                </Box>
                {userInfo.isAccept && (
                    !Utils.isEmpty(userInfo.temp, userInfo.state) ?
                        (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    p: 1,
                                    pb: 0,
                                }}
                                className='fade-in'
                            >
                                <PlaceIcon /> {/** */}
                                <Typography variant='subtitle1' mr={1}>{userInfo.state}</Typography>
                                <ThermostatIcon />
                                <Typography variant='subtitle1'>{userInfo.temp}°C</Typography>
                            </Box>
                        ) : (
                            <Skeleton animation="wave" variant='rectangular' height={40} />
                        ))}
            </Box>
            {/* END LEFT BOX */}

            {/* RIGHT BOX */}
            <Box
                sx={{
                    width: '95%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: (Utils.objSize(notes) === 0 || Utils.isEmpty(currentNote)) && 'center',
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                    }
                }}
            >
                {Utils.objSize(currentNote) !== 0 && (
                    <>
                        <Note
                            currentNote={currentNote}
                            onChangeNote={handleChangeUpdateNote}
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