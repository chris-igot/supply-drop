import { TextField as MuiTextField } from '@mui/material';
import React from 'react';
const style = {
    marginBottom: '0.51rem',
    width: '100%',
};

function TextField({ errorMessage, OkToRender, defaultValue, ...props }) {
    return (
        <>
            {OkToRender && (
                <MuiTextField
                    {...props}
                    defaultValue={defaultValue || ''}
                    error={errorMessage ? true : false}
                    helperText={errorMessage || ''}
                    sx={{ ...style, ...(props.sx || {}) }}
                />
            )}
        </>
    );
}

export default TextField;
