import { Box, Divider, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Utils from "../utils/Utils";
import ToolsHeader from '../components/ToolsHeader';

export default function Note({ currentNote, notes, noteIsPin, onChangeNote, onSubmitSearchbar, onClickDelete, onClickPin }) {
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentContent, setCurrentContent] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    /**
     * Fonction qui permet de changer l'input title
     * @param {String} event event de la fonction
     */
    const handleChangeTitle = (event) => {
        setIsTyping(true);
        setCurrentTitle((prevState) => {
            if (prevState !== event.target.value && !Utils.isEmpty(event.target.value)) {
                return event.target.value;
            }
            return event.target.value;
        });
    };

    /**
     * Fonction qui permet de changer l'input content
     * @param {String} event event de la fonction
     */
    const handleChangeContent = (event) => {
        setIsTyping(true);
        setCurrentContent((prevState) => {
            if (prevState !== event.target.value && !Utils.isEmpty(event.target.value)) {
                return event.target.value;
            }
            return event.target.value;
        });
    };

    /**
     * Fonction pour rechercher une note
     * @param {String} value 
     */
    const handleSubmitSearchbar = (value) => {
        const noteFound = notes.filter(elt => {
            return elt.title.toLowerCase() === value.toLowerCase() ||
                elt.content.toLowerCase() === value.toLowerCase()
        })[0];
        if (noteFound && !Utils.isEmpty(value)) {
            onSubmitSearchbar(noteFound.id);
        };
    };

    /**
     * Permet de mettre à jour initialement les différentes valeures des inputs
     */
    useEffect(() => {
        setCurrentTitle(currentNote.title);
        setCurrentContent(currentNote.content);
    }, [currentNote]);

    /**
     * Permet de renvoyer les valeurs des inputs après un delay de 1sec
    */
    useEffect(() => {
        const delayEntryUser = setTimeout(() => {
            if (isTyping) {
                if (!Utils.isEmpty(currentTitle) || !Utils.isEmpty(currentContent)) {
                    onChangeNote(currentTitle, currentContent, noteIsPin);
                    setIsTyping(false);
                };
            };
        }, 1000);

        return () => clearTimeout(delayEntryUser)
    }, [currentTitle, currentContent]);

    /**
     * Permet de mettre les valeurs initials du titre et du contenu dans les inputs
     */
    useEffect(() => {
        setCurrentTitle(currentNote.title);
        setCurrentContent(currentNote.content);
    }, []);

    return (
        <div className="fade-in">
            <ToolsHeader
                noteIsPin={noteIsPin}
                onClickDelete={onClickDelete}
                onClickPin={onClickPin}
                onSubmitSearchbar={handleSubmitSearchbar}
            />
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mr: 2,
                }}
            >
                <TextField
                    value={currentTitle}
                    placeholder='Ecrire un titre'
                    onChange={handleChangeTitle}
                    name='title'
                    type='text'
                    autoFocus
                    autoComplete='off'
                    required
                    inputProps={{
                        style: {
                            fontSize: '20px',
                            border: 'none',
                        }
                    }}
                    fullWidth
                />
            </Box>
            <Divider sx={{ width: 200, borderRadius: '0.5rem' }} />
            <TextField
                value={currentContent}
                placeholder='Commencez à écrire'
                onChange={handleChangeContent}
                name='content'
                type='text'
                multiline
                autoComplete='off'
                inputProps={{
                    style: {
                        height: '75vh',
                    },
                }}
                fullWidth
            />
        </div>
    );
}
