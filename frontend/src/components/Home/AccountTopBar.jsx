import React, { useState } from 'react';
import { Button, Modal, Paper, Typography, useTheme } from '@mui/material';
import { Settings } from '@mui/icons-material';
import UserForm from '../Forms/UserForm';

export function AccountTopBar(props) {
    const theme = useTheme();
    const [bigUserForm, setBigUserForm] = useState(false);

    return (
        <Paper
            elevation={6}
            sx={{
                display: 'flex',
                padding: '1rem',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Typography variant="h4" component="h4">
                Your Posts
            </Typography>
            <Button
                sx={{
                    float: 'right',
                    color: theme.palette.grey[700],
                }}
                onClick={() => setBigUserForm(true)}
            >
                Edit Account
                <Settings />
            </Button>
            <Modal open={bigUserForm}>
                <UserForm mode="edit" embiggenForm={setBigUserForm} />
            </Modal>
        </Paper>
    );
}
