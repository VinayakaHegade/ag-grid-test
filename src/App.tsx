import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { CellValueChangedEvent } from 'ag-grid-community';
import type { ColDef } from "ag-grid-community";

interface RowData {
  id: number;
  product: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
}

function App() {
  const [rowData, setRowData] = React.useState<RowData[]>([
    { id: 1, product: 'Laptop', category: 'Electronics', price: 1200, quantity: 1, total: 1200 },
    { id: 2, product: 'Desk Chair', category: 'Office', price: 150, quantity: 1, total: 150 },
    { id: 3, product: 'Coffee Maker', category: 'Kitchen', price: 80, quantity: 1, total: 80 },
    { id: 4, product: 'Printer', category: 'Electronics', price: 300, quantity: 1, total: 300 }
  ]);

  const productOptions = {
    'Electronics': [
      { label: 'Laptop', price: 1200 },
      { label: 'Smartphone', price: 800 },
      { label: 'Tablet', price: 500 },
      { label: 'Printer', price: 300 }
    ],
    'Office': [
      { label: 'Desk Chair', price: 150 }
    ],
    'Kitchen': [
      { label: 'Coffee Maker', price: 80 },
      { label: 'Toaster', price: 40 },
      { label: 'Blender', price: 60 }
    ]
  };

  const CategorySelector = (props: any) => {
    const categories = Object.keys(productOptions);

    // Only row with id 1 will have dropdown for category
    if (props.node.data.id === 1) {
      return (
        <select
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          className="w-full h-full border-0 outline-none"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      );
    }

    // All other rows show plain text
    return <span>{props.value}</span>;
  };

  const ProductSelector = (props: any) => {
    const category = props.node.data.category;
    const products = productOptions[category as keyof typeof productOptions];

    // Only show dropdown for row with id 1
    if (props.node.data.id === 1) {
      return (
        <select
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          className="w-full h-full border-0 outline-none"
        >
          {products.map(product => (
            <option key={product.label} value={product.label}>
              {product.label}
            </option>
          ))}
        </select>
      );
    }

    // All other rows show plain text
    return <span>{props.value}</span>;
  };

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'category',
      headerName: 'Category',
      cellRenderer: CategorySelector,
      editable: true,
      width: 150
    },
    {
      field: 'product',
      headerName: 'Product',
      cellRenderer: ProductSelector,
      editable: true,
      width: 150
    },
    { field: 'price', headerName: 'Price ($)', width: 120 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      editable: true,
      width: 120
    },
    {
      field: 'total',
      headerName: 'Total ($)',
      valueGetter: (params: any) => params.data.price * params.data.quantity
    }
  ];

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    const { data, colDef, newValue } = event;
    const updatedData = [...rowData];
    const rowIndex = rowData.findIndex(row => row.id === data.id);

    // Only allow changes for row with id 1
    if (data.id === 1) {
      if (colDef.field === 'category') {
        // When category changes, update product to first product in new category
        const newProducts = productOptions[newValue as keyof typeof productOptions];
        const newProduct = newProducts[0].label;
        const newPrice = newProducts[0].price;
        updatedData[rowIndex] = {
          ...data,
          category: newValue,
          product: newProduct,
          price: newPrice,
          total: newPrice * data.quantity
        };
      } else if (colDef.field === 'product') {
        // When product changes, update price
        const products = productOptions[data.category as keyof typeof productOptions];
        const newPrice = products.find(p => p.label === newValue)?.price || 0;
        updatedData[rowIndex] = {
          ...data,
          product: newValue,
          price: newPrice,
          total: newPrice * data.quantity
        };
      }
    }

    if (colDef.field === 'quantity') {
      // Update total when quantity changes (allowed for all rows)
      updatedData[rowIndex] = {
        ...data,
        quantity: Number(newValue),
        total: data.price * Number(newValue)
      };
    }

    setRowData(updatedData);
  };

   const defaultColDef: ColDef = {
     flex: 1,
   };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Product Inventory</h1>
        <div className="ag-theme-alpine h-80 w-full bg-white rounded-lg shadow-md">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            onCellValueChanged={onCellValueChanged}
            // suppressScrollOnNewData={true}
            // animateRows={true}
            defaultColDef={defaultColDef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
