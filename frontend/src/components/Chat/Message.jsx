import { Grid, Paper, Typography, useTheme } from '@mui/material';
import React from 'react';

function Message({ name, message, isSender }) {
    const theme = useTheme();
    return (
        <Grid item xs={12}>
            <Paper
                elevation={3}
                sx={{
                    maxWidth: '90%',
                    marginBottom: '0.25em',
                    padding: '0.5em 1em',
                    float: isSender ? 'right' : 'left',
                    backgroundColor: isSender
                        ? theme.palette.primary.dark
                        : theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                }}
            >
                {!isSender && (
                    <Typography variant="body2" component="p">
                        {name}
                    </Typography>
                )}
                <Typography variant="body1" component="p">
                    {message}
                </Typography>
            </Paper>
        </Grid>
    );
}

export default Message;
