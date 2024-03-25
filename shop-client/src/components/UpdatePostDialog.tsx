import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Post } from './types/PostType';

interface UpdatePostDialogProps {
    open: boolean;
    handleClose: () => void;
    handleUpdatePostData: (updatedData: Partial<Post>) => void;
    post: Post | null;
}

const UpdatePostDialog: React.FC<UpdatePostDialogProps> = ({ open, handleClose, handleUpdatePostData, post }) => {
    const [updatedData, setUpdatedData] = useState<Partial<Post>>({});

    useEffect(() => {
        if (!open) {
            setUpdatedData({});
        }
    }, [open, post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUpdatedData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleUpdate = () => {
        const updatedPostData = {
            ...updatedData,
        };
        handleUpdatePostData(updatedPostData);
    };

    const handleCloseDialog = () => {
        handleClose();
        setUpdatedData({});
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog}>
            <DialogTitle>Update Post</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="ime"
                    label="Ime"
                    type="text"
                    fullWidth
                    name="ime"
                    value={updatedData.ime}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="opis"
                    label="Opis"
                    type="text"
                    fullWidth
                    name="opis"
                    value={updatedData.opis}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="kategorija"
                    label="Kategorija"
                    type="text"
                    fullWidth
                    name="kategorija"
                    value={updatedData.kategorija}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="cijena"
                    label="Cijena"
                    type="number"
                    fullWidth
                    name="cijena"
                    value={updatedData.cijena}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="popust"
                    label="Popust u %"
                    type="number"
                    fullWidth
                    name="popust"
                    value={updatedData.popust}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    id="raspolozivo"
                    label="Raspoloživo komada"
                    type="number"
                    fullWidth
                    name="raspolozivo"
                    value={updatedData.raspolozivo}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="text"
                    name="putanjaSlike"
                    value={updatedData.putanjaSlike}
                    onChange={handleChange}
                    label="Putanja slike"
                    fullWidth
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={handleUpdate}>Update</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdatePostDialog;
