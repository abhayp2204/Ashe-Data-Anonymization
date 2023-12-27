import { Save } from "@mui/icons-material";
import Search from "@mui/icons-material/Search";
import { Button, Divider, Grid, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import React, { useEffect, useState } from "react";
import SideBar from "./Navbar";

const Anonymize = () => {
    const [originalData, setOriginalData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOriginalData, setFilteredOriginalData] =
        useState(originalData);
    const [anonymizedData, setAnonymizedData] = useState([]);
    const [filteredAnonymizedData, setFilteredAnonymizedData] =
        useState(anonymizedData);


  useEffect(() => {
    let csvData = localStorage.getItem("data");
    if (csvData) {
      const data = JSON.parse(csvData);

      let headers = data[0];
      // set rows and columns
      let locCol = [];
      for (let i = 0; i < headers.length; i++) {
        locCol.push({ field: headers[i], headerName: headers[i], width: 130 });
      }
      setColumns(locCol);

      let locRow = [];
      for (let i = 1; i < data.length; i++) {
        let row = {};
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = data[i][j];
        }
        row['id'] = i;
        locRow.push(row);

      }

      setOriginalData(locRow);
      setFilteredOriginalData(locRow);

      // Fetch anonymized data from API using Axios
      axios.get('http://localhost/api/anon/getResult')
        .then(response => {
          const data = response.data;
          Papa.parse(data, {
            complete: function (results) {
              console.log(results)
              let headers = results.data[0];
              let locRow = [];
              for (let i = 1; i < results.data.length; i++) {
                let row = {};
                for (let j = 0; j < headers.length; j++) {
                  row[headers[j]] = results.data[i][j];
                }
                row['id'] = i;
                locRow.push(row);
              }
              setAnonymizedData(locRow);
              setFilteredAnonymizedData(locRow);
            }
          })

        })
        .catch(error => {
          console.error('Error fetching anonymized data:', error);
        }
        );

    }
  }, []);



  const handleSearch = () => {
    // get the search query

    let filteredData = originalData.filter((row) => {
      let rowString = "";
      for (let i = 0; i < columns.length; i++) {
        rowString += row[columns[i].field] + " ";
      }
      return rowString.toLowerCase().includes(searchQuery.toLowerCase());
    }
    );
    setFilteredOriginalData(filteredData);

    let filteredAnonymizedData = anonymizedData.filter((row) => {
      let rowString = "";
      for (let i = 0; i < columns.length; i++) {
        rowString += row[columns[i].field] + " ";
      }
      return rowString.toLowerCase().includes(searchQuery.toLowerCase());
    }

    );
    setFilteredAnonymizedData(filteredAnonymizedData);


  };


  const handleSave = () => {
    // Convert anonymizedData to CSV format
    const csv = Papa.unparse(anonymizedData);


    // Save CSV file to user's laptop
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'anonymized-data.csv');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SideBar />
      <Box sx={{ border: '1px dashed grey', flexGrow: 1, p: 10, margin: "5%", height: "100%" }}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          width="100%"
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="standard" onClick={handleSearch}>
                  <Search />
                </Button>
              </InputAdornment>
            ),
          }}
        />

        <Divider style={{ color: 'white', backgroundColor: 'white', visibility: "hidden" }} />

        {/* save button */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          sx={{ mt: 2, mr: 2 }}
          onClick={handleSave}
        >
          Save
        </Button>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6} sx={{ pr: 2 }}>
            <DataGrid
              rows={filteredOriginalData}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ pl: 2 }}>
            <DataGrid
              rows={filteredAnonymizedData}
              columns={columns}
              autoHeight
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
            />
          </Grid>
        </Grid>

      </Box>
    </Box>

  );
};

export default Anonymize;
