import React, { useState, useEffect } from "react";

import Addcar from "./Addcar";
import Editcar from "./Editcar";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import Button from "@mui/material/Button";

export default function Carlist() {
  const [cars, setCars] = useState([]);

  useEffect(() => fetchData(), []);

  const fetchData = () => {
    fetch("https://carstockrest.herokuapp.com/cars")
      .then((response) => response.json())
      .then((data) => setCars(data._embedded.cars))
      .catch((err) => console.error(err));
  };

  const deleteCar = (link) => {
    if (window.confirm("Are you sure you want to delete?")) {
      fetch(link, { method: "DELETE" })
        .then((response) => fetchData())
        .catch((err) => console.error(err));
    }
  };

  const saveCar = (car) => {
    fetch("https://carstockrest.herokuapp.com/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((response) => fetchData())
      .catch((err) => console.error(err));
  };

  const updateCar = (car, link) => {
    fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(car),
    })
      .then((response) => fetchData())
      .catch((err) => console.error(err));
  };

  const columns = [
    { headerName: "Brand", field: "brand", sortable: true, filter: true },
    { headerName: "Model", field: "model", sortable: true, filter: true },
    { headerName: "Color", field: "color", sortable: true, filter: true },
    { headerName: "Fuel", field: "fuel", sortable: true, filter: true },
    { headerName: "Year", field: "year", sortable: true, filter: true },
    { headerName: "Price", field: "price", sortable: true, filter: true },
    {
      headerName: "Edit",
      width: 100,
      sortable: false,
      cellRenderer: (row) => <Editcar updateCar={updateCar} car={row.data} />,
    },
    {
      headerName: "Delete",
      width: 100,
      sortable: false,
      field: '_links.self.href',
      cellRenderer: (row) => (
        <Button color="error" onClick={() => deleteCar(row.value)}>
          Delete
        </Button>
      ),
    },
  ];
  return (
    <div
      className="ag-theme-material"
      style={{ height: "700px", width: "80%", margin: "auto" }}
    >
      <Addcar saveCar={saveCar} />
      <AgGridReact rowData={cars} columnDefs={columns}></AgGridReact>
    </div>
  );
}
