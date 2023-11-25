import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Avatar, Checkbox, FormControlLabel, IconButton, Modal } from '@mui/material';
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
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Utils from '../utils/Utils';

export default function ToolsHeader({ noteIsPin, profileData, noteIdChecked, onChangeCheckedDone, onClickPin, onClickDelete, onSubmitSearchbar }) {
    const [isPinActive, setIsPinActive] = useState(noteIsPin);
    const [isCheckedActive, setIsCheckedActive] = useState(noteIdChecked);

    useEffect(() => {
        setIsPinActive(noteIsPin);
    }, [noteIsPin]);

    useEffect(() => {
        setIsCheckedActive(noteIdChecked);
    }, [noteIdChecked]);

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
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <ModalConfirmationDeleteNote onClick={onClickDelete} />
                <Divider sx={{ height: 28, mx: 1 }} orientation="vertical" />
                <IconButton
                    onClick={() => {
                        onClickPin(!isPinActive);
                        setIsPinActive(!isPinActive);
                    }}
                >
                    {isPinActive ? <PushPinIcon fontSize='small' /> : <PushPinOutlinedIcon fontSize='small' />}
                </IconButton>
                <FormControlLabel
                    sx={{ mx: 0 }}
                    control={
                        <Checkbox
                            checked={isCheckedActive}
                            onChange={(_, v) => {
                                onChangeCheckedDone(v);
                                setIsCheckedActive(v)
                            }}
                            size='small'
                        />
                    }
                    label="Réalisée"
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <SearchNoteBar onSubmitSearchbar={(value) => onSubmitSearchbar(value)} />
                <ModalUser profileData={profileData} />
            </Box>
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

function ModalUser({ profileData }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    if (Utils.isEmpty(profileData)) {
        return;
    };

    return (
        <div>
            <IconButton onClick={handleOpen} sx={{ p: 0, mx: 1 }}>
                <Avatar alt={profileData.firstname.toUpperCase()} />
            </IconButton>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            p: 4,
                        }}
                    >
                        <Typography id="transition-modal-title" variant="h6" component="h2">
                            Bonjour {Utils.capitalizeFirstLetter(profileData.firstname) + ' ' + profileData.lastname.toUpperCase()}
                        </Typography>
                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                            <span style={{ fontWeight: 'bold' }}>
                                Votre e-mail&nbsp;:&nbsp;
                            </span>
                            <a
                                href={`mailto:${profileData.mail}?subject = Feedback&body = Message`}
                                style={{
                                    textDecoration: 'none',
                                    color: '#fff'
                                }}
                                target='_blank'
                                onClick={handleClose}
                            >
                                {profileData.mail}
                            </a>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}