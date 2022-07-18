/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Button,
    Chip,
    Divider,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Typography,
    TextField,
} from '@mui/material';
import './PostForm.css';
import './PostForm.css';
import AutoCompleteLocations from './AutocompleteLocations';
import { Close } from '@mui/icons-material';

const PostForm = React.forwardRef((props, ref) => {
    const { userID, postID, embiggenForm, index } = props;
    const [postInfo, setPostInfo] = useState({});
    const [errors, setErrors] = useState('');
    const [OkToRender, setOkToRender] = useState(false);

    useEffect(() => {
        if (postID) {
            getPostInfo();
        } else {
            setOkToRender(true);
        }
    }, []);

    async function getPostInfo() {
        try {
            const response = await axios.get(
                `http://localhost:8000/api/post/${postID}`,
                { withCredentials: true }
            );
            setPostInfo(response.data);
            setOkToRender(true);
        } catch (err) {
            console.log(err);
        }
    }

    function refreshPage() {
        window.location.reload(false);
    }

    function submitHandler(e) {
        e.preventDefault();
        const inputs = e.currentTarget.querySelectorAll('input,textarea');
        let data = new FormData();

        inputs.forEach((input) => {
            if (input.name === '') {
                return;
            }

            if (input.type === 'file') {
                const fileList = input.files;
                if (fileList[0]) {
                    data.append(input.name, fileList[0]);
                }
            } else if (input.type === 'radio') {
                if (input.checked) {
                    data.append(input.name, input.value);
                }
            } else {
                if (input.value) {
                    data.append(input.name, input.value);
                }
            }
        });

        if (postID) {
            if (!data.has('postType')) {
                data.append('postType', postInfo.postType);
            }
            data.append('_id', postInfo._id);

            axios
                .put(`http://localhost:8000/api/post/${postID}`, data, {
                    withCredentials: true,
                })
                .then((res) => {
                    console.log(res);
                    embiggenForm(index, false, 'form');
                    refreshPage();
                })
                .catch((err) => {
                    console.log(err.response.data.errors);
                    setErrors(err.response.data.errors);
                    return errors;
                });
        } else {
            data.append('postedBy', userID);

            axios
                .post(`http://localhost:8000/api/post/new`, data, {
                    withCredentials: true,
                })
                .then((res) => {
                    console.log(res);
                    embiggenForm(index, false, 'form');
                    refreshPage();
                })
                .catch((err) => {
                    console.log(err.response.data.errors);
                    setErrors(err.response.data.errors);
                    return errors;
                });
        }
    }

    return (
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
            <form method="post" onSubmit={submitHandler}>
                <Grid container>
                    <Grid item xs={12}>
                        {postID ? (
                            <Chip
                                label={postInfo.postType || ''}
                                sx={{
                                    padding: '4px 0 0 1px',
                                    float: 'left',
                                    fontSize: '18px',
                                    fontFamily: 'Bebas Neue',
                                    color: 'white',
                                    backgroundColor:
                                        postInfo.postType === 'offering'
                                            ? '#EE9C4A'
                                            : '#5690C3',
                                }}
                            />
                        ) : (
                            <Typography component="h3" sx={{ float: 'left' }}>
                                New Post
                            </Typography>
                        )}
                        <Close
                            sx={{ float: 'right', cursor: 'pointer' }}
                            onClick={() => {
                                embiggenForm(index, false, 'postForm');
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Divider
                            sx={{ marginTop: '8px', marginBottom: '8px' }}
                        />
                        {OkToRender && (
                            <TextField
                                id="title"
                                name="title"
                                label="Title"
                                placeholder="What are you offering/requesting?"
                                defaultValue={postInfo.title || ''}
                                sx={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    marginBottom: '1rem',
                                }}
                            />
                        )}

                        {!postID && (
                            <>
                                <Typography variant="overline" component="h6">
                                    What type of post is it?
                                </Typography>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="offering"
                                    name="postType"
                                    id="offering"
                                    sx={{ position: 'relative' }}
                                >
                                    <FormControlLabel
                                        value="offering"
                                        control={<Radio />}
                                        label="Offering"
                                        sx={{
                                            position: 'relative',
                                            top: -10,
                                        }}
                                    />
                                    <FormControlLabel
                                        value="request"
                                        control={<Radio />}
                                        label="Request"
                                        sx={{
                                            position: 'relative',
                                            top: -20,
                                        }}
                                    />
                                </RadioGroup>
                            </>
                        )}

                        <TextField
                            multiline
                            id="description"
                            name="description"
                            label="Description of item(s)"
                            rows={4}
                            placeholder="What are you offering/requesting?"
                            defaultValue={postInfo.description || ''}
                            sx={{ marginBottom: '1rem', width: '100%' }}
                        />

                        {OkToRender && (
                            <AutoCompleteLocations
                                id="location"
                                name="location"
                                defaultValue={postInfo.location}
                                label="Location"
                                variant="standard"
                                className="description-location-box"
                            />
                        )}

                        <Typography variant="overline" component="h6">
                            Add a photo
                        </Typography>
                        <input
                            type={'file'}
                            accept=".png, .jpg, .jpeg"
                            name="photo"
                        />
                        <Button
                            style={{ marginTop: '1.5rem', width: '100%' }}
                            type="submit"
                            variant="contained"
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
});

export default PostForm;
