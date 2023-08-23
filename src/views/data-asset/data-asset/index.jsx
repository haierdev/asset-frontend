import React, { useState, useEffect, useMemo } from "react";
import {
   Button,
   Card,
   CardContent,
   Grid,
   IconButton,
   InputAdornment,
   MenuItem,
   Table,
   TableBody,
   TableCell,
   TableContainer,
   TableHead,
   TableRow,
   TextField,
   Typography,
   Menu,
   ListItemIcon,
   TablePagination,
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   InputLabel,
   Select,
   OutlinedInput,
   Checkbox,
   ListItemText,
   FormControl,
   Chip,
   Divider,
   Box,
   Collapse,
   Stack,
} from "@mui/material";
import {
   CloseRounded,
   Download,
   Edit,
   FileDownload,
   FilterListRounded,
   InfoOutlined,
   KeyboardArrowDown,
   KeyboardArrowUp,
   MoreVert,
   QuestionMark,
   Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import http from "../../../component/api/Api";
import Loading from "../../../component/Loading";
import ModalDelete from "../../../component/Delete";
import moment from "moment";
import { LoadingButton } from "@mui/lab";

import { useRecoilValue } from "recoil";
import { authentication } from "../../../store/Authentication";
import { Permission } from "../../../component/Permission";
import { NumberFormat } from "../../../component/Format";
import { exportTableToExcel } from "../../../help/ExportToExcel";
import { ImportModal } from "../../../component/ImportModal";

export const longUsageFormater = (data) => {
   const { long_usage } = data
   const year = !!long_usage?.y && !!long_usage?.y !== 0 ? `${long_usage?.y} Years, ` : ''
   const month = !!long_usage?.m && !!long_usage?.m !== 0 ? `${long_usage?.m} Months, ` : ''
   const day = !!long_usage?.d && !!long_usage?.d !== 0 ? `${long_usage?.d} Days` : ''
   return `${year}${month}${day}`
}

const ButtonSupport = () => {
   const [url, setUrl] = useState({
      template: "",
      instruction: "",
   })

   const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
   };
   const handleClose = () => {
      setAnchorEl(null);
   };

   const getUrl = async (e) => {
      const { data } = await http.get(`asset/file_url`)
      setUrl({
         template: data.asset_template,
         instruction: data.asset_import_instruction
      })
   }
   useEffect(() => {
      let mounted = true
      mounted ? getUrl() : null
      return () => mounted = false
   }, [])

   return (
      <div>
         <Button
            disabled={url.instruction === "" || url.template === "" ? true : false}
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ mr: 2 }}
            variant="contained"
            startIcon={<QuestionMark />}
         >
            Instruction
         </Button>
         <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'left',
            }}
            transformOrigin={{
               vertical: 'top',
               horizontal: 'left',
            }}
            >
            <MenuItem component="a" href={url.template} target="_blank" onClick={handleClose}>Template Import Data Asset</MenuItem>
            <MenuItem component="a" href={url.instruction} target="_blank" onClick={handleClose}>Instructions Import Data Asset</MenuItem>
         </Menu>
      </div>
   );
}

const ModalFilter = (props) => {
   const [loading, setLoading] = useState(false);
   const [complete, setComplete] = useState(false);
   const [rows, setRows] = useState({
      asset_type: "all",
      category_id: [],
      employees_id: [],
      capitalized_from: null,
      capitalized_until: null,
      vendor_id: [],
      department_id: [],
      location_id: [],
      condition_id: [],
      cost_id: [],
      useful_id: [],

      device_id: [],
      brand_id: [],
      processor_id: [],
      windows_id: [],
      office_id: [],
      antivirus_id: [],
   });
   const [data, setData] = useState();
   const getCategory = async () => {
      const res = await http.get(`category`);
      return res.data.data;
   };
   const getEmployee = async () => {
      const res = await http.get(`user?paginate=0`);
      return res.data.data.data;
   };
   const getVendor = async () => {
      const res = await http.get(`vendor`);
      return res.data.data;
   };
   const getDepartment = async () => {
      const res = await http.get(`dept`);
      return res.data.data;
   };
   const getLocation = async () => {
      const res = await http.get(`location`);
      return res.data.data;
   };
   const getCondition = async () => {
      const res = await http.get(`condition`);
      return res.data.data;
   };
   const getCost = async () => {
      const res = await http.get(`cost`);
      return res.data.data;
   };
   const getUseful = async () => {
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      const res = arr.map((value) => value * 12);
      return res;
   };
   const getMasterit = async () => {
      const res = await http.get(`master_it?child=1`);
      return res.data.data;
   };

   const handleChange = async (e) => {
      const {
         target: { value },
      } = e;
      setRows({
         ...rows,
         [e.target.name]: typeof value === "string" ? value.split(",") : value,
      });
   };

   const handleComplete = () => {
      setComplete(!complete);
   };

   useEffect(() => {
      let mounted = true;
      if (mounted) {
         Promise.all([getCategory(), getEmployee(), getVendor(), getDepartment(), getLocation(), getCondition(), getCost(), getUseful(), getMasterit()]).then(
            (res) => {
               handleComplete();
               setData({
                  category: res[0],
                  employee: res[1],
                  vendor: res[2],
                  department: res[3],
                  location: res[4],
                  condition: res[5],
                  cost: res[6],
                  useful: res[7],
                  device: res[8].filter((value) => value.id === 1),
                  brand: res[8].filter((value) => value.id === 2),
                  processor: res[8].filter((value) => value.id === 3),
                  windows: res[8].filter((value) => value.id === 4),
                  office: res[8].filter((value) => value.id === 5),
                  antivirus: res[8].filter((value) => value.id === 6),
               });
            }
         );
      }
   }, []);

   const handleSubmit = () => {
      props.setParams({
         ...props.params,
         ...rows,
         page: 1,
         asset_type: rows.asset_type === "all" ? "" : rows.asset_type,
         capitalized_from: rows.capitalized_from === null ? "" : moment(rows.capitalized_from).format("yyyy-MM-DD"),
         capitalized_until: rows.capitalized_until === null ? "" : moment(rows.capitalized_until).format("yyyy-MM-DD"),
      });
      props.handleClose();
   };

   return (
      <Dialog open={props.open} onClose={props.handleClose} maxWidth="md" fullWidth>
         <DialogTitle>Filter Data Asset</DialogTitle>
         <Divider />
         {complete ? (
            <DialogContent>
               <Grid container spacing={2}>
                  <Grid item xs={12} md={12}>
                     <TextField
                        name="asset_type"
                        value={rows.asset_type}
                        fullWidth
                        select
                        onChange={(e) => {
                           setRows({
                              ...rows,
                              asset_type: e.target.value,
                           });
                        }}
                        label="Type Asset"
                     >
                        <MenuItem value="all">All Asset</MenuItem>
                        <MenuItem value="it">IT</MenuItem>
                        <MenuItem value="non-it">NON IT</MenuItem>
                     </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                           multiple
                           name="category_id"
                           value={rows.category_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Category" />}
                           renderValue={(selected) => {
                              return data.category
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.category} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.category.length > 0 &&
                              data.category.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.category_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.category} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Employee</InputLabel>
                        <Select
                           multiple
                           name="employees_id"
                           value={rows.employees_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Employee" />}
                           renderValue={(selected) => {
                              return data.employee
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.name} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.employee.length > 0 &&
                              data.employee.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.employees_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.name} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl margin="normal" fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DatePicker
                              value={rows.capitalized_from}
                              name="capitalized_from"
                              label="Capitalized From"
                              inputFormat="dd/MM/yyyy"
                              mask="__/__/____"
                              onChange={(newValue) => {
                                 setRows({
                                    ...rows,
                                    capitalized_from: newValue,
                                 });
                              }}
                              renderInput={(params) => <TextField fullWidth {...params} />}
                           />
                        </LocalizationProvider>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl margin="normal" fullWidth>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                           <DatePicker
                              minDate={rows.capitalized_from}
                              value={rows.capitalized_until}
                              name="capitalized_until"
                              label="Capitalized Until"
                              inputFormat="dd/MM/yyyy"
                              mask="__/__/____"
                              onChange={(newValue) => {
                                 setRows({
                                    ...rows,
                                    capitalized_until: newValue,
                                 });
                              }}
                              renderInput={(params) => <TextField fullWidth {...params} />}
                           />
                        </LocalizationProvider>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Vendor Name</InputLabel>
                        <Select
                           multiple
                           name="vendor_id"
                           value={rows.vendor_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Vendor Name" />}
                           renderValue={(selected) => {
                              return data.vendor
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.name} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.vendor.length > 0 &&
                              data.vendor.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.vendor_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.name} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Department Using</InputLabel>
                        <Select
                           multiple
                           name="department_id"
                           value={rows.department_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Department Using" />}
                           renderValue={(selected) => {
                              return data.department
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.dept} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.department.length > 0 &&
                              data.department.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.department_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.dept} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Asset Location</InputLabel>
                        <Select
                           multiple
                           name="location_id"
                           value={rows.location_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Asset Location" />}
                           renderValue={(selected) => {
                              return data.location
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.location} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.location.length > 0 &&
                              data.location.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.location_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.location} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Asset Condition</InputLabel>
                        <Select
                           multiple
                           name="condition_id"
                           value={rows.condition_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Asset Condition" />}
                           renderValue={(selected) => {
                              return data.condition
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.condition} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.condition.length > 0 &&
                              data.condition.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.condition_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.condition} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Cost Center Name</InputLabel>
                        <Select
                           multiple
                           name="cost_id"
                           value={rows.cost_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Cost Center Name" />}
                           renderValue={(selected) => {
                              return data.cost
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.name} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.cost.length > 0 &&
                              data.cost.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.cost_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.name} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Useful Life (Month)</InputLabel>
                        <Select
                           multiple
                           name="useful_id"
                           value={rows.useful_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Useful Life (Month)" />}
                           renderValue={(selected) => {
                              return data.useful
                                 .filter((v) => selected.includes(v))
                                 .map((v, i) => {
                                    return <Chip key={i} label={`${v} Month`} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.useful.length > 0 &&
                              data.useful.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v}>
                                       <Checkbox checked={rows.useful_id.indexOf(v) > -1} />
                                       <ListItemText primary={`${v} Month`} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
               </Grid>
               <Divider sx={{ my: 5 }} />
               <Typography fontWeight="bold" pb={2}>
                  Filter IT
               </Typography>
               <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Device</InputLabel>
                        <Select
                           multiple
                           name="device_id"
                           value={rows.device_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Device" />}
                           renderValue={(selected) => {
                              return data.device[0].sub_master_it
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.sub_type} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.device[0].sub_master_it?.length > 0 &&
                              data.device[0].sub_master_it.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.device_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.sub_type} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Brand</InputLabel>
                        <Select
                           multiple
                           name="brand_id"
                           value={rows.brand_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Brand" />}
                           renderValue={(selected) => {
                              return data.brand[0].sub_master_it
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.sub_type} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.brand[0].sub_master_it?.length > 0 &&
                              data.brand[0].sub_master_it.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.brand_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.sub_type} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Processor</InputLabel>
                        <Select
                           multiple
                           name="processor_id"
                           value={rows.processor_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Processor" />}
                           renderValue={(selected) => {
                              return data.processor[0].sub_master_it
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.sub_type} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.processor[0].sub_master_it?.length > 0 &&
                              data.processor[0].sub_master_it.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.processor_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.sub_type} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Windows OS</InputLabel>
                        <Select
                           multiple
                           name="windows_id"
                           value={rows.windows_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Windows OS" />}
                           renderValue={(selected) => {
                              return data.windows[0].sub_master_it
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.sub_type} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.windows[0].sub_master_it?.length > 0 &&
                              data.windows[0].sub_master_it.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.windows_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.sub_type} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Office</InputLabel>
                        <Select
                           multiple
                           name="office_id"
                           value={rows.office_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Office" />}
                           renderValue={(selected) => {
                              return data.office[0].sub_master_it
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.sub_type} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.office[0].sub_master_it?.length > 0 &&
                              data.office[0].sub_master_it.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.office_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.sub_type} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <FormControl sx={{ mt: 1 }} fullWidth>
                        <InputLabel>Antivirus</InputLabel>
                        <Select
                           multiple
                           name="antivirus_id"
                           value={rows.antivirus_id}
                           onChange={handleChange}
                           input={<OutlinedInput label="Antivirus" />}
                           renderValue={(selected) => {
                              return data.antivirus[0].sub_master_it
                                 .filter((v) => selected.includes(v.id))
                                 .map((v, i) => {
                                    return <Chip key={i} label={v.sub_type} onDelete={() => "cemas"} sx={{ mr: 0.5 }} />;
                                 });
                           }}
                        >
                           {data.antivirus[0].sub_master_it?.length > 0 &&
                              data.antivirus[0].sub_master_it.map((v, i) => {
                                 return (
                                    <MenuItem key={i} value={v.id}>
                                       <Checkbox checked={rows.antivirus_id.indexOf(v.id) > -1} />
                                       <ListItemText primary={v.sub_type} />
                                    </MenuItem>
                                 );
                              })}
                        </Select>
                     </FormControl>
                  </Grid>
               </Grid>
            </DialogContent>
         ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
               <Loading />
            </Box>
         )}
         <Divider />
         {complete && (
            <DialogActions sx={{ py: 2, px: 3 }}>
               <LoadingButton loading={loading} variant="contained" onClick={handleSubmit}>
                  Apply
               </LoadingButton>
            </DialogActions>
         )}
      </Dialog>
   );
};

const role = ["Admin Department", "Employee"]
const RowComponent = (props) => {
   const [open, setOpen] = React.useState(false);
   return (
      <React.Fragment>
         <TableRow>
            <TableCell component="th" scope="row" align="center">
               <Stack direction="row" alignItems={"center"} justifyContent={"center"}>
                  <IconButton disabled={role.includes(props.user.role)} aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                     {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </IconButton>
                  {props.from + props.i}.
               </Stack>
            </TableCell>
            <TableCell>{props.data.asset_code}</TableCell>
            <TableCell>{props.data.asset_name}</TableCell>
            <TableCell>{props.data.employee.name}</TableCell>
            <TableCell>{props.data.department === null ? "-" : props.data.department.dept}</TableCell>
            <TableCell>{`${props.data.location === null ? " " : props.data.location.code} - ${props.data.location === null ? " ": props.data.location.location}`}</TableCell>
            <TableCell>{props.data.category.category}</TableCell>
            <TableCell>{props.data.condition.condition}</TableCell>
            <TableCell>{moment(props.data.capitalized).format("ll")}</TableCell>
            <TableCell>{props.data.sub_category.useful_life}</TableCell>
            <TableCell>{longUsageFormater(props.data)}</TableCell>
            {props.user.role !== "Employee" && (
               <>
                  <TableCell>{NumberFormat(props.data.acquisition_value, "Rp")}</TableCell>
                  <TableCell>{NumberFormat(props.data.book_value, "Rp")}</TableCell>
               </>
            )}
            <TableCell align="center">
               <IconButton onClick={(e) => props.handleClick(e, props.data)}>
                  <MoreVert />
               </IconButton>
            </TableCell>
         </TableRow>
         <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                     {props.data.evidence.length > 0 &&
                     <Typography mt={3}>Image & Evidence</Typography>
                     }
                     {props.data.evidence.length === 0 &&
                     <Typography mt={3}>Image & Evidence Kosong</Typography>
                     }
                     <Table size="small" aria-label="purchases">
                        <TableBody>
                           {props.data.evidence.map((val, i) => (
                              <TableRow key={val.id}>
                                 <TableCell component="th" scope="row">
                                    {i + 1}
                                 </TableCell>
                                 <TableCell>{val.file.split("/").pop()}</TableCell>
                                 <TableCell align="right">
                                    <Chip label="Download" component="a" href={val.file} target="_blank" />
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>
      </React.Fragment>
   );
};

const TableExport = (props) => {
   return (
      <table id="table-export" style={{ display: "none" }}>
         <thead>
            <tr>
               <th>asset_type</th>
               <th>asset_code</th>
               <th>category_code</th>
               <th>category_name</th>
               <th>sub_category</th>
               <th>asset_name</th>
               <th>specification</th>
               <th>useful_life</th>
               <th>long_usage</th>
               <th>capitalized</th>
               <th>sap_code</th>
               <th>employee_id</th>
               <th>employee_name</th>
               <th>location_code</th>
               <th>location_name</th>
               <th>department_id</th>
               <th>department_name</th>
               <th>condition_id</th>
               <th>condition_name</th>
               <th>latitude</th>
               <th>longitude</th>
               <th>cost_center_code</th>
               <th>cost_center_name</th>
               <th>acquisition_value</th>
               <th>depreciation</th>
               <th>vendor_code</th>
               <th>vendor_name</th>
               <th>book_value</th>
               <th>device_id</th>
               <th>device_name</th>
               <th>type</th>
               <th>brand_id</th>
               <th>brand_name</th>
               <th>monitor_inch</th>
               <th>model_brand</th>
               <th>mac_address</th>
               <th>warranty</th>
               <th>computer_name</th>
               <th>dlp</th>
               <th>soc</th>
               <th>snnbpc</th>
               <th>processor_id</th>
               <th>processor_name</th>
               <th>hardware</th>
               <th>os_id</th>
               <th>os_name</th>
               <th>sn_windows</th>
               <th>office_id</th>
               <th>office_name</th>
               <th>SN Office</th>
               <th>antivirus_id</th>
               <th>antivirus_name</th>
               <th>notes</th>
               <th>attachment</th>
               <th>picture</th>
            </tr>
         </thead>
         <tbody>
            {props.data.map((val, i) => {
               return (
                  <tr key={i}>
                     <td>{val.asset_type}</td>
                     <td>{val.asset_code}</td>
                     <td>{val.category.code}</td>
                     <td>{val.category.category}</td>
                     <td>{val.sub_category.sub_category}</td>
                     <td>{val.asset_name}</td>
                     <td>{val.specification}</td>
                     <td>{val.useful_life}</td>
                     <td>{longUsageFormater(val)}</td>
                     <td>=TEXT("{val.capitalized}";"yyyy/MM/DD")</td>
                     <td>'{val.sap_code}</td>
                     <td>{val.employee.code}</td>
                     <td>{val.employee.name}</td>
                     <td>{val.location.code}</td>
                     <td>{val.location.location}</td>
                     <td>{val.department.id}</td>
                     <td>{val.department.dept}</td>
                     <td>{val.condition.id}</td>
                     <td>{val.condition.condition}</td>
                     <td>{val.latitude}</td>
                     <td>{val.longitude}</td>
                     <td>{val.cost.code}</td>
                     <td>{val.cost.name}</td>
                     <td>{val.acquisition_value}</td>
                     <td>{val.depreciation == 1 ? 1 : 0}</td>
                     <td>{val.vendor.code}</td>
                     <td>{val.vendor.name}</td>
                     <td>{val.book_value}</td>
                     <td>{val.device ? val.device.id : ""}</td>
                     <td>{val.device ? val.device.sub_type : ""}</td>
                     <td>{val.type}</td>
                     <td>{val.brand ? val.brand.id : ""}</td>
                     <td>{val.brand ? val.brand.sub_type : ""}</td>
                     <td>{val.monitor_inch}</td>
                     <td>{val.model_brand}</td>
                     <td>{val.mac_address}</td>
                     <td>{val.warranty === null ? null : `=TEXT("${val.warranty}";"yyyy-MM-DD")`}</td>
                     <td>{val.computer_name}</td>
                     <td>{val.dlp}</td>
                     <td>{val.soc}</td>
                     <td>{val.snnbpc}</td>
                     <td>{val.processor ? val.processor.id : ""}</td>
                     <td>{val.processor ? val.processor.sub_type : ""}</td>
                     <td>{val.hardware ? val.hardware.sub_type : ""}</td>
                     <td>{val.os ? val.os.id : ""}</td>
                     <td>{val.os ? val.os.sub_type : ""}</td>
                     <td>{val.sn_windows}</td>
                     <td>{val.office ? val.office.id : ""}</td>
                     <td>{val.office ? val.office.sub_type : ""}</td>
                     <td>{val.sn_office}</td>
                     <td>{val.antivirus ? val.antivirus.id : ""}</td>
                     <td>{val.antivirus ? val.antivirus.sub_type : ""}</td>
                     <td>{val.notes}</td>
                     <td>
                        {val.evidence.length > 0 &&
                           val.evidence.map((v, i) => (
                              <a key={i} href={v.file}>
                                 {v.file.split("/").pop()} <br />
                              </a>
                           ))}
                     </td>
                     <td>
                        {val.picture.length > 0 &&
                           val.picture.map((v, i) => (
                              <a key={i} href={v.file}>
                                 {v.file.split("/").pop()} <br />
                              </a>
                           ))}
                     </td>
                  </tr>
               );
            })}
         </tbody>
      </table>
   );
};

const Index = () => {
   const { user } = useRecoilValue(authentication);

   const navigate = useNavigate();
   const [rows, setRows] = useState();
   const [exportData, setExportData] = useState();
   const [data, setData] = useState({
      code: "",
      location: "",
   });
   const [field, setField] = useState([]);
   const [params, setParams] = useState({
      search: "",
      order_by_name: 0,
      limit: 10,
      page: 1,
      paginate: 1,
   });
   const [loading, setLoading] = useState(false);
   const [fieldOption, setFieldOption] = useState([]);

   const getData = async () => {
      http
         .get(`/asset`, {
            params: {
               ...params,
               field,
            },
         })
         .then((res) => {
            setRows(res.data.data);
         })
         .catch((err) => {
         });
   };

   const [exportLoading, setExportLoading] = useState(false)
   const getDataExport = async () => {
      setExportLoading(true)
      setExportData()
      http
         .get(`/asset`, {
            params: {
               ...params,
               field,
               paginate: 0,
            },
         })
         .then((res) => {
            setExportData(res.data.data.data);
            setExportLoading(false)
         })
         .catch((err) => {});
   };
   const handleDownload = async () => {
      try {
         const res = await getDataExport()
      } catch (err) {
         console.log(err) 
      }
   };

   useEffect(() => {
      let mount = true
      if(!!exportData){
         if(!mount) return; 
         exportTableToExcel("#table-export", "Data asset");
         setExportData()
      }
      return () => mount = false
   }, [exportData])

   const getField = async () => {
      const res = await http.get("asset/field_asset");
      setFieldOption([...res.data.data]);
   };

   useEffect(() => {
      let mounted = true;
      if (mounted) {
         getField();
      }

      return () => (mounted = false);
   }, []);

   useEffect(() => {
      setRows(undefined);
      setExportData(undefined);
      let timer = setTimeout(() => {
         if (params) {
            getData();
         }
      }, 500);
      return () => clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [params]);

   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   const handleSearch = (e) => {
      setParams({
         ...params,
         page: 1,
         [e.target.name]: e.target.value,
      });
   };

   const handleChangePage = (event, newPage) => {
      setParams({
         ...params,
         page: newPage + 1,
      });
   };

   const handleChangeRowsPerPage = (event) => {
      setParams({
         ...params,
         page: 1,
         limit: +event.target.value,
      });
   };

   const handleEdit = () => {
      setData(staging);
      handleMenu();
      if (staging.asset_type === "it") {
         navigate(`/edit-data-asset-it/${staging.id}`);
      } else {
         navigate(`/edit-data-asset-non-it/${staging.id}`);
      }
   };

   const handleDetail = () => {
      setData(staging);
      handleMenu();
      if (staging.asset_type === "it") {
         navigate(`/detail-data-asset-it/${staging.id}`);
      } else {
         navigate(`/detail-data-asset-non-it/${staging.id}`);
      }
   };

   const [openModal, setOpenModal] = useState(false);
   const handleModal = (e) => {
      setOpenModal(!openModal);
   };

   const [modalFilter, setModalFilter] = useState(false);
   const handleModalFilter = () => {
      setModalFilter(!modalFilter);
   };

   const onDelete = async () => {
      http
         .delete(`/asset/${staging.id}`, {})
         .then((res) => {
            getData();
            handleMenu();
            handleModal();
         })
         .catch((err) => {
            setLoading(false);
         });
   };

   //Import
   const [openImport, setOpenImport] = useState(false);
   const handleCloseImport = () => {
      setOpenImport(!openImport);
   };

   //staging
   const [staging, setStaging] = useState();
   const [anchorEl, setAnchorEl] = useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event, value) => {
      setAnchorEl(event.currentTarget);
      setStaging(value);
   };
   const handleMenu = () => {
      setAnchorEl(null);
   };

   return (
      <div className="main-content mb-5">
         <div className="page-content">
            <div className="container">
               <div className="my-2">
                  <div className="d-flex mb-3 align-items-center justify-content-between">
                     <h3 className="fw-bold">Data Asset</h3>
                     <Box display={"flex"}>
                        {Permission(user.permission, "create asset") && (
                           <Box display="flex">
                              <ButtonSupport />
                              <Button variant="contained" onClick={handleCloseImport} startIcon={<FileDownload />}>
                                 Import
                              </Button>
                           </Box>
                        )}
                        <LoadingButton
                           // disabled={exportData == undefined ? true : false}
                           loading={exportLoading}
                           sx={{ ml: 2 }}
                           variant="contained"
                           onClick={handleDownload}
                           startIcon={<Download />}
                        >
                           Export
                        </LoadingButton>
                     </Box>
                  </div>
                  {Permission(user.permission, "create asset") && (
                     <Grid container spacing={3}>
                        <Grid item md={6} xs={12}>
                           <Card>
                              <CardContent>
                                 <Typography>Asset IT</Typography>
                                 <Button sx={{ mt: 1 }} onClick={() => navigate("/data-asset-it")} variant="contained">
                                    Create Asset IT
                                 </Button>
                              </CardContent>
                           </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                           <Card>
                              <CardContent>
                                 <Typography>Asset Non IT</Typography>
                                 <Button sx={{ mt: 1 }} onClick={() => navigate("/data-asset-non-it")} variant="contained">
                                    Create Asset Non IT
                                 </Button>
                              </CardContent>
                           </Card>
                        </Grid>
                     </Grid>
                  )}
               </div>
               <div className="row">
                  <div className="col-xl-12 col-12 mt-3">
                     <Card>
                        <CardContent>
                           <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                              <Grid item xs={12} md={3}>
                                 <FormControl fullWidth>
                                    <InputLabel>Field</InputLabel>
                                    <Select
                                       multiple
                                       name="filed"
                                       value={field}
                                       onChange={(e) => {
                                          const {
                                             target: { value },
                                          } = e;
                                          setField(typeof value === "string" ? value.split(",") : value);
                                       }}
                                       input={<OutlinedInput label="Field" />}
                                       renderValue={(selected) => {
                                          return fieldOption
                                             .filter((v) => selected.includes(v.field))
                                             .map((v) => {
                                                return <Chip label={v.title} onDelete={() => "s"} />;
                                             });
                                       }}
                                    >
                                       {fieldOption.length > 0 &&
                                          fieldOption.map((v, i) => {
                                             return (
                                                <MenuItem key={v.field} value={v.field}>
                                                   <Checkbox checked={field.indexOf(v.field) > -1} />
                                                   <ListItemText primary={v.title} />
                                                </MenuItem>
                                             );
                                          })}
                                    </Select>
                                 </FormControl>
                              </Grid>
                              <Grid item xs>
                                 <TextField
                                    name="search"
                                    variant="outlined"
                                    label="Search"
                                    autoComplete="off"
                                    onChange={handleSearch}
                                    value={params.search}
                                    InputProps={{
                                       startAdornment: (
                                          <InputAdornment position="start">
                                             <Search fontSize="small" />
                                          </InputAdornment>
                                       ),
                                       endAdornment: params.search !== "" && (
                                          <InputAdornment position="end">
                                             <IconButton onClick={() => setParams({ ...params, search: "" })}>
                                                <CloseRounded />
                                             </IconButton>
                                          </InputAdornment>
                                       ),
                                    }}
                                    fullWidth
                                 />
                              </Grid>
                              <Grid item xs={2}>
                                 <Button onClick={handleModalFilter} variant="link" startIcon={<FilterListRounded />}>
                                    Filter
                                 </Button>
                              </Grid>
                           </Grid>
                           <TableContainer>
                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                 <TableHead>
                                    <TableRow
                                       sx={{
                                          "& th:first-of-type": { borderRadius: "0.5em 0 0 0.5em" },
                                          "& th:last-of-type": { borderRadius: "0 0.5em 0.5em 0" },
                                       }}
                                    >
                                       <TableCell align="center">No.</TableCell>
                                       <TableCell>Code Asset</TableCell>
                                       <TableCell>Asset Name</TableCell>
                                       <TableCell>PIC Name</TableCell>
                                       <TableCell>Department</TableCell>
                                       <TableCell>Location</TableCell>
                                       <TableCell>Category Asset</TableCell>
                                       <TableCell>Asset Condition</TableCell>
                                       <TableCell>Capitalized On</TableCell>
                                       <TableCell>Useful Life</TableCell>
                                       <TableCell>Long Usage</TableCell>
                                       {user.role !== "Employee" && (
                                          <>
                                             <TableCell>Acquisition Value</TableCell>
                                             <TableCell>Book Value</TableCell>
                                          </>
                                       )}
                                       <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                 </TableHead>
                                 <TableBody>
                                    {rows !== undefined ? (
                                       rows.data.length > 0 ? (
                                          rows.data.map((value, key) => (
                                             <RowComponent i={key} key={key} data={value} user={user} from={rows.meta.from} handleClick={handleClick} />
                                          ))
                                       ) : (
                                          <TableRow>
                                             <TableCell component="th" scope="row" sx={{ textAlign: "center", py: 10 }} colSpan={10}>
                                                No result found
                                                {params.search !== "" && (
                                                   <div style={{ display: "inline-block" }}>
                                                      &nbsp;for "<b>{params.search}</b>"
                                                   </div>
                                                )}
                                                .
                                             </TableCell>
                                          </TableRow>
                                       )
                                    ) : (
                                       <TableRow>
                                          <TableCell component="th" scope="row" sx={{ textAlign: "center", py: 5 }} colSpan={10}>
                                             <Loading />
                                          </TableCell>
                                       </TableRow>
                                    )}
                                 </TableBody>
                              </Table>
                              {exportData !== undefined && <TableExport data={exportData} />}

                           </TableContainer>
                           {rows !== undefined && rows.data.length > 0 && (
                              <TablePagination
                                 component="div"
                                 count={rows.meta.total}
                                 page={params.page - 1}
                                 rowsPerPage={params.limit}
                                 onPageChange={handleChangePage}
                                 onRowsPerPageChange={handleChangeRowsPerPage}
                                 rowsPerPageOptions={[10, 25, 50, 100]}
                                 showFirstButton
                                 showLastButton
                              />
                           )}
                        </CardContent>
                     </Card>
                  </div>
                  <div className="col-xl-4 col-12 mt-3">
                     {/* utils */}
                     <ModalDelete open={openModal} delete={onDelete} handleClose={handleModal} />
                     <ModalFilter open={modalFilter} params={params} setParams={setParams} handleClose={handleModalFilter} />
                     {/* <ModalImport open={openImport} handleClose={handleCloseImport} getData={getData} /> */}
                     <ImportModal
                        buttonTitle={"Import Asset (.xlsx)"}
                        getData={getData}
                        handleClose={handleCloseImport}
                        open={openImport}
                        url={"asset/import_excel"}
                     />

                     {/* menu */}
                     <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenu}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                     >
                        {Permission(user.permission, "update asset") && (
                           <MenuItem onClick={handleEdit}>
                              <ListItemIcon>
                                 <Edit />
                              </ListItemIcon>
                              Edit
                           </MenuItem>
                        )}
                        <MenuItem onClick={handleDetail}>
                           <ListItemIcon>
                              <InfoOutlined />
                           </ListItemIcon>
                           Detail
                        </MenuItem>
                        {/* <MenuItem onClick={handleModal}>
                           <ListItemIcon>
                              <Delete />
                           </ListItemIcon>
                           Delete
                        </MenuItem> */}
                     </Menu>
                     
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Index;
