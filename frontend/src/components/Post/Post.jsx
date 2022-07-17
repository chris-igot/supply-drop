import React from 'react';
import './post.css';

import StartChat from '../Chat/StartChat';
import {
    Divider,
    Grid,
    ImageList,
    ImageListItem,
    Paper,
    Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const Post = React.forwardRef(
    (
        {
            postType,
            title,
            description,
            image,
            location,
            postedBy,
            _id,
            embiggenForm,
            index,
        },
        ref
    ) => (
        <Paper
            elevation={3}
            sx={{
                padding: '1rem',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <Grid container>
                <Grid item xs={10}>
                    <Typography component="h4" sx={{ fontWeight: 800 }}>
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    <Close
                        sx={{ float: 'right', cursor: 'pointer' }}
                        onClick={() => {
                            embiggenForm(index, false, 'post');
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ marginTop: '8px', marginBottom: '8px' }} />
                </Grid>
                <Grid item xs={12}>
                    {image && (
                        <ImageList
                            cols={4}
                            rowHeight={150}
                            sx={{ width: '100%', height: 150 }}
                        >
                            <ImageListItem>
                                <img
                                    style={{ objectFit: 'cover' }}
                                    src={'http://localhost:8000/img/' + image}
                                    alt={title}
                                />
                            </ImageListItem>
                        </ImageList>
                    )}
                    <Divider sx={{ marginTop: '8px', marginBottom: '0' }} />
                    <Typography variant="overline" component="h6">
                        Description
                    </Typography>
                    <Typography component="p">{description}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ marginTop: '8px', marginBottom: '0' }} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="overline" component="h6">
                        Chat
                    </Typography>
                    <StartChat recipientId={postedBy._id} />
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="overline" component="h6">
                        Location
                    </Typography>
                    <iframe
                        title="googlemap"
                        width="100%"
                        height="300"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUbRiOy26TfHguvbRi-9XsLa_oRNvQ_fY&q=${location}`}
                    ></iframe>
                </Grid>
            </Grid>
        </Paper>
    )
);

export default Post;
