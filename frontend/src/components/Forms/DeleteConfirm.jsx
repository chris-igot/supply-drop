import { Close, DeleteForever } from '@mui/icons-material';
import { Button, Grid, Modal, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';

function DeleteConfirm({ confirmMessage, onClick, sx }) {
    const [showConfirm, setShowConfirm] = useState(false);
    return (
        <>
            <DeleteForever
                color="error"
                onClick={() => {
                    setShowConfirm(true);
                }}
                sx={sx}
            />
            <Modal open={showConfirm}>
                <Paper
                    sx={{
                        padding: '1rem',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                    }}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ float: 'left' }}>
                                Confirm delete?
                            </Typography>
                            <Close
                                sx={{ float: 'right', cursor: 'pointer' }}
                                onClick={() => {
                                    setShowConfirm(false);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="p">
                                {confirmMessage}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="button"
                                variant="contained"
                                color="error"
                                sx={{
                                    width: '100%',
                                    marginRight: '0.5rem',
                                    marginTop: '1rem',
                                }}
                                onClick={(e) => {
                                    onClick(e);
                                    setShowConfirm(false);
                                }}
                            >
                                Delete
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                type="button"
                                variant="outlined"
                                color="primary"
                                sx={{
                                    width: '100%',
                                    marginLeft: '0.5rem',
                                    marginTop: '1rem',
                                }}
                                onClick={() => {
                                    setShowConfirm(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Modal>
        </>
    );
}

export default DeleteConfirm;
