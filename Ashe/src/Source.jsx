import CloseIcon from "@mui/icons-material/Close";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import { DataGrid } from "@mui/x-data-grid";
import * as React from "react";
import SideBar from "./Navbar";
// axios
import axios from "axios";
import Papa from 'papaparse';
export default function BoxComponent() {
  const [datasetName, setDatasetName] = React.useState(""); // name of the dataset
  const [rows, setRows] = React.useState([]); // rows of the dataset
  const [columns, setColumns] = React.useState([]); // columns of the dataset

  function handleFileUpload(event) {
    // Handle main CSV file upload
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // upload file to backend
    axios.post('http://localhost/api/anon/uploadSource', formData)
    .then(response => {
        console.log("File uploaded successfully")
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    });

    // Parse it to view in the web editor
    const reader = new FileReader();
    reader.onload = function (e) {
    const csv = e.target.result;
    Papa.parse(csv, {
        complete: function (results) {
            localStorage.setItem('name', file.name)
            localStorage.setItem('data', JSON.stringify(results.data));
            let headers = results.data[0]
            // set rows and columns
            let locCol = []
            for (let i = 0; i < headers.length; i++) {
                locCol.push({ field: headers[i], headerName: headers[i], width: 130 })
            }
            setColumns(locCol)

        let locRow = []
        for (let i = 1; i < results.data.length; i++) {
            let row = {}
            for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = results.data[i][j]
            }
            row['id'] = i
            locRow.push(row)
        }
        setRows(locRow)

        },
        error: function (error) {
        console.log(error);
        }
    });
    };
    reader.readAsText(file);
    setDatasetName(file.name);

  }
  return (
    <Box sx={{ display: "flex" }}>
      <SideBar />

      <Box
        component="span"
        sx={{
          p: 10,
          border: "1px dashed grey",
          margin: "5% auto",
          width: "70%",
          height: "100%",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Button
            sx={{ margin: "10px auto", display: "block", textAlign: "center" }}
            variant="contained"
            color="primary"
            size="large"
            component="label"
          >
            Add File
            <input
              type="file"
              style={{ display: "none" }}
              accept="text/csv"
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
        <FormControl sx={{ width: "100%" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Dataset Name
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton aria-label="toggle password visibility" edge="end">
                  <FolderSharedIcon />
                </IconButton>
              </InputAdornment>
            }
            label="Dataset Name"
            value={datasetName}
          />
        </FormControl>

        <div margin="10px 5px 2px 5px">
          <div style={{ height: 30, width: "100%", margin: "0px" }}></div>
        </div>
        <div style={{ height: 300, width: "100%", margin: "5px" }}>
          <DataGrid rows={rows} columns={columns} pageSize={5} />
        </div>

        <Button type="submit" variant="contained" sx={{ m: 1 }} onClick={() => { window.location.href = "/sourcenext"; }}>
          Next
          <IconButton aria-label="next icon" edge="end" color="inherit">
            <KeyboardTabIcon />
          </IconButton>
        </Button>

        <Button type="submit" variant="outlined" sx={{ m: 1 }} onClick={() => { window.location.href = "/source"; }}>
          Cancel
          <IconButton aria-label="next icon" edge="end" color="inherit">
            <CloseIcon />
          </IconButton>
        </Button>
      </Box>
    </Box>
  );
}
