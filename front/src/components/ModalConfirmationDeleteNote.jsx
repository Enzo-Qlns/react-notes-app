import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogContentText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AlertDialogSlide({ onClick }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen}>
                <DeleteIcon fontSize='small' />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                component={'form'}
                onSubmit={(e) => {
                    e.preventDefault();
                    onClick();
                    handleClose();
                }}
            >
                <DialogTitle>Êtes-vous sûr de votre action ?</DialogTitle>
                <DialogContent>Cette action est irréversible</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='error'>Annuler</Button>
                    <Button
                        variant='contained'
                        type='submit'
                    >
                        Confirmer
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}