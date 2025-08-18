import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Todo } from '../models/todo.model';
import { Person } from '../models/person.model';

// Extend jsPDF interface to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  exportTodosToExcel(todos: Todo[], filename: string = 'todos'): void {
    const exportData = todos.map(todo => ({
      'Title': todo.titre,
      'Assigned To': todo.person.name,
      'Start Date': new Date(todo.startDate).toLocaleDateString(),
      'End Date': todo.endDate ? new Date(todo.endDate).toLocaleDateString() : 'Not completed',
      'Priority': todo.priority,
      'Labels': todo.labels.join(', '),
      'Description': todo.description,
      'Status': todo.completed ? 'Completed' : 'Pending'
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Todos');

    // Auto-size columns
    const colWidths = Object.keys(exportData[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportTodosToPDF(todos: Todo[], filename: string = 'todos'): void {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Todo List Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    // Prepare data for table
    const headers = ['Title', 'Assigned To', 'Start Date', 'Priority', 'Status'];
    const data = todos.map(todo => [
      todo.titre,
      todo.person.name,
      new Date(todo.startDate).toLocaleDateString(),
      todo.priority,
      todo.completed ? 'Completed' : 'Pending'
    ]);

    // Add table
    autoTable(doc,{
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    doc.save(`${filename}.pdf`);
  }

  exportPersonsToExcel(persons: Person[], filename: string = 'persons'): void {
    const exportData = persons.map(person => ({
      'Name': person.name,
      'Email': person.email,
      'Phone': person.phone
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Persons');

    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportPersonsToPDF(persons: Person[], filename: string = 'persons'): void {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text('Persons List Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    const headers = ['Name', 'Email', 'Phone'];
    const data = persons.map(person => [
      person.name,
      person.email,
      person.phone
    ]);

    autoTable(doc,{
      head: [headers],
      body: data,
      startY: 40,
      styles: {
        fontSize: 10,
        cellPadding: 4
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255
      }
    });

    doc.save(`${filename}.pdf`);
  }
}
