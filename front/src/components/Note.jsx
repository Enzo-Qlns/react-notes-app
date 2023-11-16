import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Utils from "../utils/Utils";

export default function Note({ currentNote, onChangeNote }) {
    const [currentTitle, setCurrentTitle] = useState(currentNote.title);
    const [currentContent, setCurrentContent] = useState(currentNote.content);
    const [isTyping, setIsTyping] = useState(false);

    /**
     * Fonction qui permet de changer l'input title
     * @param {String} e event de la fonction
     */
    const handleChangeTitle = (e) => {
        setIsTyping(true);
        setCurrentTitle((prevState) => {
            if (prevState !== e.target.value && !Utils.isEmpty(e.target.value)) {
                return e.target.value;
            }
            return e.target.value;
        });
    };

    /**
     * Fonction qui permet de changer l'input content
     * @param {String} e event de la fonction
     */
    const handleChangeContent = (e) => {
        setIsTyping(true);
        setCurrentContent((prevState) => {
            if (prevState !== e.target.value && !Utils.isEmpty(e.target.value)) {
                return e.target.value;
            }
            return e.target.value;
        });
    };

    /**
     * Permet de mettre à jour initialement les différentes valeures des inputs
     */
    useEffect(() => {
        setCurrentTitle(currentNote.title);
        setCurrentContent(currentNote.content);
    }, [currentNote]);

    /**
     * Permet de renvoyer les valeurs des inputs après un delay de 500ms
     */
    useEffect(() => {
        const delayEntryUser = setTimeout(() => {
            if (isTyping) {
                if (!Utils.isEmpty(currentTitle) || !Utils.isEmpty(currentContent)) {
                    onChangeNote(currentTitle, currentContent);
                    setIsTyping(false);
                };
            };
        }, 500);

        return () => clearTimeout(delayEntryUser)
    }, [currentTitle, currentContent]);

    return (
        <>
            <TextField
                value={currentTitle}
                placeholder='Ecrire un titre'
                onChange={handleChangeTitle}
                name='title'
                type="text"
                autoFocus
                autoComplete="off"
                required
                inputProps={{
                    style: {
                        fontSize: '20px',
                        border: 'none',
                    }
                }}
                fullWidth
            />
            <TextField
                value={currentContent}
                placeholder='Commencez à écrire'
                onChange={handleChangeContent}
                name='content'
                type='text'
                multiline
                maxRows={2}
                autoComplete="off"
                inputProps={{
                    style: {
                        height: '80vh',
                    },
                }}
                fullWidth
            />
        </>
    );
}
