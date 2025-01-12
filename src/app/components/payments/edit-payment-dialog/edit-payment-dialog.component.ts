import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PaymentsService } from '../../../services/payments.service'; // Import service

@Component({
  selector: 'app-edit-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-payment-dialog.component.html',
  styleUrls: ['./edit-payment-dialog.component.css'],
})
export class EditPaymentDialogComponent {
  editForm: FormGroup;
  isCompleted = false;
  file: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentsService: PaymentsService // Inject the service
  ) {
    this.editForm = this.fb.group({
      payee_first_name: [data.payee_first_name, [Validators.required]],
      payee_last_name: [data.payee_last_name, [Validators.required]],
      payee_due_date: [data.payee_due_date, [Validators.required]],
      payee_payment_status: [data.payee_payment_status, [Validators.required]],
      payee_address_line_1: [data.payee_address_line_1, [Validators.required]],
      payee_address_line_2: [data.payee_address_line_2],
      payee_city: [data.payee_city, [Validators.required]],
      payee_country: [data.payee_country, [Validators.required]],
      payee_province_or_state: [data.payee_province_or_state],
      payee_postal_code: [data.payee_postal_code, [Validators.required]],
      payee_phone_number: [data.payee_phone_number, [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      payee_email: [data.payee_email, [Validators.required, Validators.email]],
      discount_percent: [data.discount_percent, [Validators.min(0), Validators.max(100)]],
      tax_percent: [data.tax_percent, [Validators.min(0), Validators.max(100)]],
      due_amount: [data.due_amount, [Validators.required]],
      total_due: [data.total_due]
    });

    this.isCompleted = data.payee_payment_status === 'completed';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.file = input.files[0];
    }
  }

  save(): void {
    // Check if form is invalid
    if (this.editForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const updatedPayment = {
      payee_first_name: this.editForm.value.payee_first_name,
      payee_last_name: this.editForm.value.payee_last_name,
      payee_payment_status: this.editForm.value.payee_payment_status,
      payee_added_date_utc: new Date(this.data.payee_added_date_utc).toISOString,
      payee_due_date: new Date(this.editForm.value.payee_due_date).toDateString, 
      payee_address_line_1: this.editForm.value.payee_address_line_1,
      payee_address_line_2: this.editForm.value.payee_address_line_2 || null,
      payee_city: this.editForm.value.payee_city,
      payee_country: this.editForm.value.payee_country,
      payee_province_or_state: this.editForm.value.payee_province_or_state || null,
      payee_postal_code: this.editForm.value.payee_postal_code,
      payee_phone_number: this.editForm.value.payee_phone_number,
      payee_email: this.editForm.value.payee_email,
      currency: this.data.currency || 'USD',
      discount_percent: this.editForm.value.discount_percent || 0,
      tax_percent: this.editForm.value.tax_percent || 0,
      due_amount: this.editForm.value.due_amount,
      total_due: this.editForm.value.total_due,
    };

    const isStatusChangingToCompleted =
    updatedPayment.payee_payment_status === 'completed' &&
    this.data.payee_payment_status !== 'completed';

    if (isStatusChangingToCompleted && !this.file) {
      alert('Please upload an evidence file to mark the payment as completed.');
      return;
    }

    if (isStatusChangingToCompleted) {
      if (!this.file) {
      alert('Please upload an evidence file to mark the payment as completed.');
      return;
    }
      const formData = new FormData();
      formData.append('file', this.file);

      this.paymentsService.uploadEvidence(this.data.id, formData).subscribe({
        next: () => {
          console.log('Evidence uploaded successfully!');
          this.dialogRef.close(updatedPayment);
        },
        error: (err) => {
          console.error('Error uploading evidence:', err);
          alert('Failed to upload evidence. Please try again.');
        },
      });
    } else {
      this.dialogRef.close(updatedPayment);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  onStatusChange(status: string): void {
    this.isCompleted = status === 'completed';
  }
}
