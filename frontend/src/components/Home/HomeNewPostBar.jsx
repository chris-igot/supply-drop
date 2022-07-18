import React from 'react';
import logo from '../../assets/logo.webp';
import { Chip, Paper } from '@mui/material';

export function HomeNewPostBar({ setBigForm }) {
    return (
        <Paper
            sx={{
                display: 'flex',
                padding: '0.25rem 0.75rem 0.25rem 0.25rem',
                alignItems: 'center',
            }}
        >
            <img src={logo} alt="" srcSet="" className="supply-drop" />
            <Chip
                label="What can you offer/request?"
                sx={{
                    flexGrow: 1,
                    color: 'gray',
                }}
                onClick={(e) => {
                    e.preventDefault();
                    setBigForm(true);
                }}
            />
        </Paper>
    );
}
