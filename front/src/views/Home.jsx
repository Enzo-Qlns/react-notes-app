import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Box, Card, CardActionArea, CardContent, CircularProgress, IconButton, Pagination, Typography } from '@mui/material';
import Fade from '@mui/material/Fade';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DateManager from '../utils/DateManager';
import Utils from '../utils/Utils';
import Note from '../components/Note';
import { toast } from 'react-toastify';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

export default function Home({ getNotes, updateNote, addNote, deleteNote, getWeather, getProfile }) {
    const [notes, setNotes] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [userInfo, setUserInfo] = useState({
        temp: null,
        state: null,
        isAccept: false
    });
    const navigate = useNavigate();
    const params = useParams();
    const paramsNoteId = Number.parseInt(params.noteId);
    const [isLoadingRequest, setIsLoadingRequest] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const notesPerPage = 9;
    const [profileData, setProfileData] = useState(null);

    /**
     * Fonction pour récupérer les notes
     */
    const fetchNote = () => {
        if (!Utils.isEmpty(getNotes, addNote)) {
            getNotes((notes) => {
                setIsLoadingRequest(false);
                // Filtre les notes par pin et date de derniere modification
                const notesSorted = notes.sort((a, b) => {
                    if (a.pin && !b.pin) return -1;
                    if (!a.pin && b.pin) return 1;
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                setNotes(notesSorted);
                // Met a jour la page de la note pour la pagination
                const selectedNoteIndex = notes.findIndex((note) => note.id === paramsNoteId);
                if (selectedNoteIndex !== -1) {
                    const page = Math.ceil((selectedNoteIndex + 1) / notesPerPage);
                    setCurrentPage(page);
                }
                // if (!Utils.isEmpty(notesSorted) && Utils.isEmpty(paramsNoteId)) {
                //     navigate('/notes/' + notesSorted[0].id);
                // };
            });
        };
    };

    /**
     * Fonction pour ajouter une note
     */
    const fecthAddNote = () => {
        if (!Utils.isEmpty(addNote)) {
            addNote("", "", new Date(), (res) => {
                setNotes(current => [res, ...current]);
                navigate('/notes/' + (res.id));
            });
        };
    };

    /**
     * Fonction pour modifier une note
     * @param {String} title
     * @param {String} content
     */
    const fetchUpdateNote = (title, content, pin, checked) => {
        if (!Utils.isEmpty(updateNote, addNote, pin, checked)) {
            updateNote(paramsNoteId, title.toString(), content.toString(), pin, checked, new Date(), notes.find(elt => paramsNoteId === elt.id).createdAt, () => {
                setIsSaving(true);
                fetchNote();
                setTimeout(() => {
                    setIsSaving(false);
                }, 1000);
            });
        };
    };

    const fetchDeleteNote = () => {
        deleteNote(paramsNoteId, () => {
            getNotes((notes) => {
                toast.success('Note supprimée avec succès', { position: 'bottom-right' })
                const notesSorted = notes.sort((a, b) => {
                    if (a.pin && !b.pin) return -1;
                    if (!a.pin && b.pin) return 1;
                    return new Date(b.updatedAt) - new Date(a.updatedAt);
                });
                setNotes(notesSorted);
                if (!Utils.isEmpty(notesSorted))
                    navigate('/notes/' + notesSorted[0].id);
                else
                    navigate('/notes');
            });
        });
    };

    /**
     * Requête initiale pour récupérer les notes && vérifie si paramsNoteId dans url
     */
    useEffect(() => {
        setIsLoadingRequest(true);
        fetchNote();
        if (!Utils.isEmpty(getWeather, getProfile)) {
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

            getProfile((res) => setProfileData(res));
        };
    }, []);

    return (
        <Box display={'flex'} height={'100vh'}>

            {/* LEFT BOX */}
            <Box sx={{ width: 250 }}>
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
                    <IconButton onClick={fecthAddNote}>
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
                    {isLoadingRequest
                        ? <Typography textAlign={'center'} mt={2}>
                            Chargement
                            <CircularProgress sx={{ ml: 2 }} size={20} />
                        </Typography>
                        : Utils.isEmpty(notes)
                            ? <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}
                            >
                                <Typography variant="h6" color={'grey'}>Aucune note</Typography>
                            </Box>
                            :
                            <>
                                {notes
                                    .slice((currentPage * notesPerPage) - notesPerPage, currentPage * notesPerPage)
                                    .map(note => (
                                        <Card
                                            key={note.id}
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
                                                disabled={paramsNoteId === note.id}
                                                onClick={() => navigate('/notes/' + note.id)}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        variant='h6'
                                                        gutterBottom
                                                        component={'div'}
                                                        display={'flex'}
                                                        alignItems={'center'}
                                                        justifyContent={'space-between'}
                                                    >
                                                        {note.title}
                                                        {note.checked
                                                            ? <CheckCircleRoundedIcon />
                                                            : <CheckCircleOutlineIcon />
                                                        }
                                                    </Typography>
                                                    <Typography color='text.secondary' fontSize={'11px'} variant='caption' gutterBottom>
                                                        {DateManager.convertDate(note.updatedAt)}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    ))}
                            </>
                    }
                </Box>
                {Math.ceil(notes.length / notesPerPage) > 1 && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 1,
                        }}
                    >
                        <Pagination
                            count={Math.ceil(notes.length / notesPerPage)}
                            shape="rounded"
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            size='small'
                            hidePrevButton
                            hideNextButton
                        />
                    </Box>)}
            </Box>
            {/* END LEFT BOX */}

            {/* RIGHT BOX */}

            <Box
                sx={{
                    width: '95%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: (Utils.objSize(notes) === 0 || Utils.isEmpty(notes.filter(elt => elt.id === paramsNoteId)[0])) && 'center',
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                    },
                    cursor: 'text',
                }}
                onClick={notes.length === 0 ? fecthAddNote : null}
            >
                {!Utils.isEmpty(notes) && (
                    Utils.isEmpty(notes.find(elt => elt.id === paramsNoteId))
                        ? <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6" color={'grey'}>Sélectionnez une note</Typography>
                        </Box>
                        :
                        <>
                            <Note
                                currentNote={notes.find(elt => elt.id === paramsNoteId)}
                                onChangeNote={fetchUpdateNote}
                                notes={notes}
                                noteIsPin={notes.find(elt => elt.id === paramsNoteId).pin}
                                noteIdChecked={notes.find(elt => elt.id === paramsNoteId).checked}
                                onSubmitSearchbar={id => navigate('/notes/' + id)}
                                onClickDelete={fetchDeleteNote}
                                onClickPin={(pin) => {
                                    const title = notes.find(elt => elt.id === paramsNoteId).title;
                                    const content = notes.find(elt => elt.id === paramsNoteId).content;
                                    const checked = notes.find(elt => elt.id === paramsNoteId).checked;
                                    fetchUpdateNote(title, content, pin, checked);
                                }}
                                onChangeCheckedDone={(checked) => {
                                    const title = notes.find(elt => elt.id === paramsNoteId).title;
                                    const content = notes.find(elt => elt.id === paramsNoteId).content;
                                    const pin = notes.find(elt => elt.id === paramsNoteId).pin;
                                    fetchUpdateNote(title, content, pin, checked);
                                }}
                                profileData={profileData}
                            />
                            {isSaving && (
                                <Fade in={isSaving}>
                                    <Typography variant='body1' sx={{ mx: 3 }}>Enregistré !</Typography>
                                </Fade>)}
                        </>
                )}
            </Box>
            {/* END RIGHT BOX */}

        </Box >
    );
};