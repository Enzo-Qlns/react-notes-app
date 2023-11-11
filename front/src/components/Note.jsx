import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Utils from "../utils/Utils";

export default function Note({ currentNote, onChangeNote }) {
    const [currentTitle, setCurrentTitle] = useState(currentNote.title);
    const [currentContent, setCurrentContent] = useState(currentNote.content);
    const [isTyping, setIsTyping] = useState(false);

    const handleChangeTitle = (e) => {
        setIsTyping(true);
        setCurrentTitle((prevState) => {
            if (prevState !== e.target.value && !Utils.isEmpty(e.target.value)) {
                return e.target.value;
            }
            return e.target.value;
        });
    };

    const handleChangeContent = (e) => {
        setIsTyping(true);
        setCurrentContent((prevState) => {
            if (prevState !== e.target.value && !Utils.isEmpty(e.target.value)) {
                return e.target.value;
            }
            return e.target.value;
        });
    };

    useEffect(() => {
        setCurrentTitle(currentNote.title);
        setCurrentContent(currentNote.content);
    }, [currentNote]);

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
        <Box
            sx={{
                width: '100%',
                height: '95%',
                bgcolor: 'var(--grey)',
            }}
            component={'form'}
        >
            <Box
                sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: 'none',
                    }
                }}
            >
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
                            fontSize: '20px'
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
                    autoComplete="off"
                    inputProps={{
                        style: {
                            height: '70vh',
                        },
                    }}
                    fullWidth
                />
            </Box>
        </Box>
    );
}
