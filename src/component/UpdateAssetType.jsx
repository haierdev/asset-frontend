import React, { useMemo } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { LoadingButton } from "@mui/lab";

export default function ModalUpdateAssetType({ open, handleClose, onClick, staging, loading }) {
    const valueMemo = useMemo(() => {
        if(!!!staging) return {}
        return {
            nextAssetType: staging?.asset_type === 'it' ? 'non-it' : 'it'
        }
    }, [staging])
    return (
        <Dialog
            fullWidth
            maxWidth="xs"
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>Update Asset Type</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure want to change this asset
                    <Box component='span' sx={{ fontWeight: 'bold', ml: 1, fontStyle: 'italic', color: 'black' }}>({staging?.asset_name})</Box> from 
                    <Box component='span' sx={{ fontWeight: 'bold', mr: 1, fontStyle: 'italic', color: 'black' }}>"{staging?.asset_type}"</Box>
                    to 
                    <Box component='span' sx={{ fontWeight: 'bold', ml: 1, fontStyle: 'italic', color: 'black' }}>"{valueMemo?.nextAssetType}"</Box>?
                    <br />
                    <Box component='span' sx={{ fontWeight: 'bold', mt: 1, fontStyle: 'italic', fontSize: '0.8rem', color: 'red' }}>*Be careful, this action can't be undone!</Box>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="text" onClick={handleClose}>
                    Cancel
                </Button>
                <LoadingButton loading={loading} variant="text" color="success" onClick={onClick} autoFocus>
                    Update Asset Type
                </LoadingButton>
            </DialogActions>
        </Dialog>
    );
}
