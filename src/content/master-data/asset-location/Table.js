import React, { Component } from 'react';

import Box from '@mui/material/Box';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import { deleteLocation } from './services/Data'

// edit button
export const editLink = (param) => {

    return (
        <div className="btn-group dropstart">

            <button className="btn dropdown-toggle p-0" type="button" id="filterDashboard" data-bs-toggle="dropdown" aria-expanded="false">
                <i className='bi bi-three-dots-vertical fs-3'></i>
            </button>
            <ul className="dropdown-menu dropstart-custom-table w-auto" aria-labelledby="filterDashboard">
                <li className='w-100 py-2' onClick={() => this.props.editData(param.row)}>
                    <div className="form-check text-end me-3">
                        <label className="form-check-label fs-5">
                            Edit
                            <i className='bi bi-pencil-fill mx-2'></i>
                        </label>
                    </div>
                </li>
                <li className='w-100 py-2' onClick={() => deleteData(param.row.code)}>
                    <div className="form-check text-end me-3">
                        <label className="form-check-label fs-5">
                            Delete
                            <i className='bi bi-trash-fill mx-2'></i>
                        </label>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export const deleteData = async (param) => {
    const remove = await deleteLocation(param.code)

    console.log(param)
    console.log(remove)
}

class Table extends Component {

    constructor(props) {
        super(props)

        this.state = {
            dataLocation: (this.props.dataLocation) ? this.props.dataLocation : [],
            isLoading: false
        }
    }

    render() {

        const rows = (this.props.dataLocation) ? this.props.dataLocation : this.state.dataLocation
        const isLoading = (this.props.isLoading) ? this.props.isLoading : this.state.isLoading

        const columns = [
            {
                field: 'number',
                headerName: 'No',
                width: 50,
                type: 'number'
            },
            {
                field: 'code',
                headerName: 'Code',
                width: 150,
            },
            {
                field: 'location',
                headerName: 'Location',
                width: 180,
            },
            {
                field: 'parent_location',
                headerName: 'Parent Location',
                width: 150,
            },
            {
                field: 'id',
                headerName: ' ',
                width: 50,
                renderCell: editLink,
                sortable: false
            }
        ];


        return (
            <div className='card shadow-none border-1' >
                <div className='card-body'>
                    {/* Table */}

                    <div>
                        <Box sx={{
                            height: 450,
                            width: '100%'
                        }}>
                            <DataGrid
                                sx={{
                                    boxShadow: 0,
                                    border: 0,
                                }}
                                loading={isLoading}
                                dataLocation={this.Table}
                                disableColumnMenu
                                disableColumnFilter
                                disableColumnSelector
                                disableColumnButton
                                disableDensitySelector
                                checkboxSelection
                                columns={columns}
                                pageSize={5}
                                rows={rows}
                                rowsPerPageOptions={[5]}
                                components={{
                                    LoadingOverlay: LinearProgress,
                                    Toolbar: GridToolbar
                                }}
                                componentsProps={{
                                    toolbar: {
                                        quickFilterProps: { debounceMs: 500 },
                                        showQuickFilter: true,
                                    },
                                }}
                            />
                        </Box>
                    </div >
                </div>
            </div>
        )
    }
}

export default Table