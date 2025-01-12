import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentsService } from '../../../services/payments.service';
import { Payment } from '../../../models/payment.model';
import { TableModule } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { EditPaymentDialogComponent } from '../edit-payment-dialog/edit-payment-dialog.component';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, EditPaymentDialogComponent],
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css'],
})
export class MainScreenComponent implements OnInit {
  payments: Payment[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  page: number = 1;
  size: number = 20;
  totalRecords: number = 0;
  sortField: string = 'payee_last_name';
  sortOrder: number = 1;

  constructor(
    private paymentsService: PaymentsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fetchPayments();
  }

  fetchPayments(): void {
    const params = {
        search: this.searchQuery,
        status: this.selectedStatus.toLowerCase(),
        page: this.page.toString(),
        size: this.size.toString(),
        sort_by: this.sortField,
        sort_order: this.sortOrder === 1 ? 'asc' : 'desc',
    };

    this.paymentsService.getPayments(params).subscribe({
      next: (response) => {
        this.payments = response.data;
        this.totalRecords = response.total;
      },
      error: (err) => {
        console.error('Error fetching payments:', err);
      },
    });
  }

  onSearch(): void {
    this.page = 1; // Reset to the first page on a new search
    this.fetchPayments();
  }

  onDelete(paymentId: string): void {
    this.paymentsService.deletePayment(paymentId).subscribe(() => {
      alert('Payment deleted successfully!');
      this.fetchPayments();
    });
  }

  onEdit(payment: Payment): void {
    const dialogRef = this.dialog.open(EditPaymentDialogComponent, {
      data: payment,
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe((updatedPayment) => {
      if (updatedPayment) {
        this.paymentsService.updatePayment(payment.id!, updatedPayment).subscribe({
          next: () => {
            alert('Payment updated successfully!');
            this.fetchPayments();
          },
          error: (err) => {
            console.error('Error updating payment:', err);
          },
        });
      }
    });
  }

  onUploadEvidence(paymentId: string | undefined, event: Event): void {
    if (!paymentId) {
      console.error('Payment ID is missing');
      return;
    }
  
    const inputElement = event.target as HTMLInputElement;
    if (inputElement?.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      const formData = new FormData();
      formData.append('file', file);
  
      this.paymentsService.uploadEvidence(paymentId, formData).subscribe({
        next: () => {
          alert('Evidence uploaded successfully!');
          this.fetchPayments();
        },
        error: (err) => {
          console.error('Error uploading evidence:', err);
        },
      });
    } else {
      console.error('No file selected');
    }
  }

  loadPayments(event: any): void {
    this.page = Math.floor(event.first / event.rows) + 1;
    this.size = event.rows;
    this.sortField = event.sortField || '';
    this.sortOrder = event.sortOrder || 1;
    this.fetchPayments();
  }

  getDownloadLink(paymentId: string): string {
    return this.paymentsService.getEvidenceDownloadLink(paymentId);
  }
}
