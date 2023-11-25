import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ModalConfirmationDeleteNote from './ModalConfirmationDeleteNote';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Divider, Link } from '@mui/material';
import IosShareIcon from '@mui/icons-material/IosShare';
import Menu from '@mui/material/Menu';
import { toast } from 'react-toastify';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

export default function ToolsHeader({ noteIsPin, onClickPin, onClickDelete, onSubmitSearchbar }) {
    const [isPinActive, setIsPinActive] = useState(noteIsPin);

    useEffect(() => {
        setIsPinActive(noteIsPin);
    }, [noteIsPin]);

    return (
        <Box
            sx={{
                p: 0.5,
                width: '100%',
                bgcolor: 'var(--bg-tools)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div style={{ display: 'flex' }}>
                <IconButton
                    onClick={() => {
                        onClickPin(!isPinActive);
                        setIsPinActive(!isPinActive);
                    }}
                >
                    {isPinActive ? <PushPinIcon fontSize='small' /> : <PushPinOutlinedIcon fontSize='small' />}
                </IconButton>
                <ModalConfirmationDeleteNote onClick={onClickDelete} />
            </div>
            <div>
                <SearchNoteBar onSubmitSearchbar={(value) => onSubmitSearchbar(value)} />
            </div>
        </Box>
    );
}

function SearchNoteBar({ onSubmitSearchbar }) {
    const submitSearchBar = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        onSubmitSearchbar(data.get('search'));
    };

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 350 }}
            onSubmit={submitSearchBar}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Chercher une note"
                name='search'
                autoComplete='off'
            />
            <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <MenuShare />
        </Paper>
    );
}

function MenuShare() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <IconButton
                color="primary"
                sx={{ p: '10px' }}
                aria-label="share"
                onClick={handleClick}
            >
                <IosShareIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
                sx={{ mt: 1 }}
            >
                <Link
                    sx={{
                        px: 1,
                        cursor: 'pointer',
                    }}
                    variant="body2"
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Lien copié !', { position: 'bottom-right' });
                        setTimeout(() => {
                            handleClose();
                        }, 100);
                    }}
                >
                    {window.location.href}
                </Link>
            </Menu>
        </>
    );
}