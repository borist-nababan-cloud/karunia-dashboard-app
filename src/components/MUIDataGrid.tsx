"use client";

import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridCellParams,
} from "@mui/x-data-grid";
import {
  Button,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useState } from "react";

interface MUIDataGridProps {
  data: any[];
  columns: string[];
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onAdd?: () => void;
  loading?: boolean;
  addButtonLabel?: string;
  title?: string;
  entityName?: string;
}

export default function MUIDataGrid({
  data,
  columns,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
  addButtonLabel = "Add New",
  title,
  entityName = "Item",
}: MUIDataGridProps) {
  
  // Create a styled delete icon
  const StyledDeleteIcon = styled(DeleteIcon)(({ theme }) => ({
    color: theme.palette.error.main,
    "&:hover": {
      color: theme.palette.error.dark,
    },
  }));

  // Transform columns for MUI Data Grid
  const gridColumns: GridColDef[] = columns.map((col) => ({
    field: col,
    headerName: col.charAt(0).toUpperCase() + col.slice(1),
    flex: 1,
    minWidth: 120,
    headerClassName: "data-grid-header",
    renderCell: (params: GridCellParams) => {
      // Handle special cases for certain fields
      if (col === "status") {
        const value = params.value as string;
        return (
          <Chip
            label={value}
            color={value === "active" ? "success" : "default"}
            size="small"
            variant="outlined"
          />
        );
      }
      if (col === "createdAt" || col === "updatedAt") {
        const date = new Date(params.value as string);
        return date.toLocaleDateString();
      }
      return params.value as string;
    },
  }));

  // Add actions column
  if (onEdit || onDelete) {
    gridColumns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 120,
      getActions: (params: GridRowParams) => {
        const actions: JSX.Element[] = [];

        if (onEdit) {
          actions.push(
            <GridActionsCellItem
              key="edit"
              icon={
                <Tooltip title="Edit">
                  <EditIcon />
                </Tooltip>
              }
              label="Edit"
              onClick={() => onEdit(params.id)}
            />
          );
        }

        if (onDelete) {
          actions.push(
            <GridActionsCellItem
              key="delete"
              icon={
                <Tooltip title="Delete">
                  <StyledDeleteIcon />
                </Tooltip>
              }
              label="Delete"
              onClick={() => onDelete(params.id)}
            />
          );
        }

        return actions;
      },
    });
  }

  return (
    <Box className="w-full">
      {title && (
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
      )}
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="body2" color="text.secondary">
          {data.length} {entityName}(s) total
        </Typography>
        {onAdd && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            className="bg-primary hover:bg-primary/90"
          >
            {addButtonLabel}
          </Button>
        )}
      </Box>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={gridColumns}
          loading={loading}
          getRowId={(row) => row.id || row._id}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          sx={{
            "& .data-grid-header": {
              fontWeight: 600,
            },
            // Custom scrollbar styling to match your design
            "& ::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "& ::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "& ::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "& ::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        />
      </Box>
    </Box>
  );
}