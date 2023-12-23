import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Papa from 'papaparse';
import * as React from "react";
import SideBar from "./Navbar";

export default function SourceNext() {
  const [rows, setRows] = React.useState([]); // rows for data grid (the one containing the mainCSV columns per row)
  React.useEffect(() => {
    if (localStorage.getItem("data") !== null) {
      // get the data from local storage and feed it to the data grid
      var data = JSON.parse(localStorage.getItem("data"));
      console.log(data);
      let cols = data[0]
      let curRows = []
      for (var i = 0; i < cols.length; i++) {
        let cRow = {}
        console.log("Running")
        cRow["id"] = i
        cRow["attribute"] = cols[i]
        cRow["type"] = type[3].value
        cRow["dataTypes"] = datatype[0].value
        curRows.push(cRow)
      }
      setRows(curRows)
    }
    else {
      window.location.href = "/source"
    }
  }, [])
  const [showPassword, setShowPassword] = React.useState(false);
  var heirarcy_data = {}

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const type = [
    { value: 'INSENSTIIVE', label: 'Insensitive' },
    { value: 'SENSITIVE', label: 'Sensitive' },
    { value: 'IDENTIFYING', label: 'Identifying' },
    { value: 'QUASI_IDENTIFYING', label: 'Quasi-Identifying' },

  ]

  const datatype = [
    { value: 'string', label: 'String' },
    { value: 'int', label: 'Integer' },
    { value: 'float', label: 'Float' },
    { value: 'date', label: 'Date' }
  ]
  // handle type change
  const handleTypeChange = (event, id) => {
    let curRows = rows
    curRows[id].type = event.target.value
    setRows(curRows)
  }

  const handleDataTypeChange = (event, id) => {
    let curRows = rows
    curRows[id].dataTypes = event.target.value
    setRows(curRows)
  }


  // stores the columns of the datagrid (they are constant across all files)
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "attribute", headerName: "Attribute", width: 130 },
    {
      // Dropdown for type (insensitive, sensitive, etc)
      field: "type", headerName: "Type", width: 130, renderCell: (params) => (

        <TextField
          select
          label="Type"
          sx={{ width: "100%", outline: "none" }}
          variant="standard"
          value={params.row.type}
          onChange={(event) => handleTypeChange(event, params.row.id)}
        >
          {type.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

      ),
    },
    {
      // Dropdown for data types
      field: "dataTypes", headerName: "Data Types", width: 130, renderCell: (params) => (

        <TextField

          select
          label="datatype"
          sx={{ width: "100%" }}
          variant="standard"
          value={params.row.dataTypes}
          onChange={(event) => handleDataTypeChange(event, params.row.id)}

        >
          {datatype.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

      ),
    },
    {
      // Upload button
      field: "heirarchy", headerName: "Heirarchy", width: 130, renderCell: (params) => (
        <strong>
          <Button width="100%" variant="contained" sx={{ margin: "10px" }} component="label" id={params.row.id}>
            Upload
            <input
              label="Upload"
              type="file"
              style={{ display: "none" }}
              accept="text/csv"
              onChange={(event) => handleFileUpload1(event, params.row.id)}
            />

          </Button>
        </strong>
      ),
    },



  ];

  function submitdata() {
    console.log(rows)
    localStorage.setItem("Hdata", JSON.stringify(rows));
    // localStorage.setItem("heirarchy", JSON.stringify(heirarcy_data));
    console.log(localStorage.getItem("data"));
    // console.log(localStorage.getItem("heirarchy"));
    window.location.href = "/config";
  }

  function handleFileUpload1(event, row_id) {
    // Upload heirarchy file for the attribute
    console.log("Called for ", rows[row_id].attribute)
    const file = event.target.files[0];
    // get attribute name selected
    let mainCsvName = localStorage.getItem("name")
    // format <mainCsvName>_heirarchy_<attribute_name>.csv
    // remove .csv
    mainCsvName = mainCsvName.slice(0, -4)
    const hFileName = mainCsvName + "_hierarchy_" + rows[row_id].attribute + ".csv"
    const formData = new FormData();
    formData.append('file', file, hFileName);

    // var attribute = attribute_ip
    axios.post('http://localhost/api/anon/uploadHierarchy', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });


    const reader = new FileReader();
    const attribute = rows[row_id].attribute

    reader.onload = function (e) {
      const csv = e.target.result;
      const data = Papa.parse(csv, { header: true }).data;
      console.log(data);
      heirarcy_data[attribute] = data
      console.log(heirarcy_data)

      // make green button
      var btn = document.getElementById(row_id);
      btn.style.backgroundColor = "green";
      btn.style.color = "white";
      btn.innerHTML = "Uploaded";
    }
    reader.readAsText(file);
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
        <h3>Variables Configuration</h3>
        <div style={{ height: 400, width: "100%", }}>
          <DataGrid
            sx={{ height: "400px" }}
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </div>
        <Button type="submit" variant="contained" sx={{ m: 1 }} onClick={submitdata}>
          Submit
          <KeyboardTabIcon />
        </Button>
      </Box>
    </Box>
  );
}
