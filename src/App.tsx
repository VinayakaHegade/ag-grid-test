import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  CellValueChangedEvent,
  ICellRendererParams,
  ValueGetterParams,
} from "ag-grid-community";
import type { ColDef } from "ag-grid-community";

interface RowData {
  id: number;
  product: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
}

interface ProductOption {
  label: string;
  price: number;
}

interface ProductOptions {
  [key: string]: ProductOption[];
}

interface CellRendererProps extends ICellRendererParams<RowData> {
  value: string;
  setValue: (value: string) => void;
}

function App() {
  const [rowData, setRowData] = useState<RowData[]>([
    {
      id: 1,
      product: "2024",
      category: "Electronics",
      price: 1500,
      quantity: 1,
      total: 1500,
    },
    {
      id: 2,
      product: "2024",
      category: "Kitchen",
      price: 100,
      quantity: 1,
      total: 100,
    },
    {
      id: 3,
      product: "2024",
      category: "Office",
      price: 200,
      quantity: 1,
      total: 200,
    },
  ]);

  const productOptions: ProductOptions = {
    Electronics: [
      { label: "2024", price: 1500 },
      { label: "2023", price: 1200 },
    ],
    Office: [{ label: "2024", price: 200 }],
    Kitchen: [{ label: "2024", price: 100 }],
  };

  const CategorySelector = (props: CellRendererProps) => {
    if (!props.node.data) return null;
    return <span>{props.value}</span>;
  };

  const ProductSelector = (props: CellRendererProps) => {
    if (!props.node.data) return null;

    const category = props.node.data.category;
    const options = productOptions[category];

    if (options.length > 1) {
      return (
        <select
          value={props.value}
          onChange={(e) => props.setValue(e.target.value)}
          className="w-full h-full border-0 outline-none"
        >
          {options.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    return <span>{props.value}</span>;
  };

  const columnDefs: ColDef<RowData>[] = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "category",
      headerName: "Category",
      cellRenderer: CategorySelector,
      width: 150,
    },
    {
      field: "product",
      headerName: "Year",
      cellRenderer: ProductSelector,
      editable: ({ data }) => {
        const category = data?.category || "";
        const options = productOptions[category];
        return options.length > 1;
      },
      width: 150,
    },
    { field: "price", headerName: "Price ($)", width: 120 },
    {
      field: "quantity",
      headerName: "Quantity",
      editable: true,
      width: 120,
    },
    {
      field: "total",
      headerName: "Total ($)",
      valueGetter: (params: ValueGetterParams<RowData>) =>
        (params.data?.price || 0) * (params.data?.quantity || 0),
    },
  ];

  const onCellValueChanged = (event: CellValueChangedEvent<RowData>) => {
    const { data, colDef, newValue } = event;
    if (!data) return;

    const updatedData = [...rowData];
    const rowIndex = rowData.findIndex((row) => row.id === data.id);

    if (colDef.field === "product" && data.category === "Electronics") {
      const newPrice =
        productOptions.Electronics.find((p) => p.label === newValue)?.price ||
        0;
      updatedData[rowIndex] = {
        ...data,
        product: newValue as string,
        price: newPrice,
        total: newPrice * data.quantity,
      };
    } else if (colDef.field === "quantity") {
      updatedData[rowIndex] = {
        ...data,
        quantity: Number(newValue),
        total: data.price * Number(newValue),
      };
    }

    setRowData(updatedData);
  };

  const defaultColDef: ColDef<RowData> = {
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
            defaultColDef={defaultColDef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
