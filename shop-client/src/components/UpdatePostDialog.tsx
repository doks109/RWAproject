import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { Post } from './types/PostType';

interface UpdatePostDialogProps {
    open: boolean;
    handleClose: () => void;
    handleUpdatePostData: (updatedData: Partial<Post>) => void;
    post: Post | null;
}

const UpdatePostDialog: React.FC<UpdatePostDialogProps> = ({ open, handleClose, handleUpdatePostData, post }) => {
    const [updatedData, setUpdatedData] = useState<Partial<Post>>({});
    const [isAvailable, setIsAvailable] = useState<boolean>(post?.raspolozivo || false);

    useEffect(() => {
        if (!open) {
            setUpdatedData({});
            setIsAvailable(post?.raspolozivo || false);
        }
    }, [open, post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value.trim() === '' ? undefined : value;

        if (name === 'raspolozivo') {
            setIsAvailable(checked);
        } else {
            setUpdatedData(prevData => ({ ...prevData, [name]: newValue }));
        }
    };

    const handleUpdate = () => {
        const updatedPostData = {
            ...updatedData,
            raspolozivo: isAvailable
        };
        handleUpdatePostData(updatedPostData);
    };

    const handleCloseDialog = () => {
        handleClose();
        setUpdatedData({});
        setIsAvailable(false);
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
                    value={updatedData.ime || post?.ime || ''}
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
                    value={updatedData.opis || post?.opis || ''}
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
                    value={updatedData.kategorija || post?.kategorija || ''}
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
                    value={updatedData.cijena || post?.cijena || ''}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="text"
                    name="putanjaSlike"
                    value={updatedData.putanjaSlike || post?.putanjaSlike || ''}
                    onChange={handleChange}
                    label="Putanja slike"
                    fullWidth
                    required
                />
                <FormControlLabel
                    control={<Checkbox name="raspolozivo" checked={isAvailable} onChange={handleChange} />}
                    label={"Raspolozivo"}
                />
                <FormControlLabel
                    control={<Checkbox name="nijeRaspolozivo" checked={!isAvailable} onChange={(e) => setIsAvailable(!e.target.checked)} />}
                    label={"Nije raspolozivo"}
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
