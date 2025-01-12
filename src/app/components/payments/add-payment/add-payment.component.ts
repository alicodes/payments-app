import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentsService } from '../../../services/payments.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.css'],
})
export class AddPaymentComponent {
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private paymentsService: PaymentsService) {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_payment_status: [{ value: 'pending', disabled: true }, Validators.required],
      payee_added_date_utc: [new Date().toISOString(), Validators.required], // Auto-generated, ISO string
      payee_due_date: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''], // Optional
      payee_city: ['', Validators.required],
      payee_country: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]], // ISO 3166-1 alpha-2
      payee_province_or_state: [''], // Optional
      payee_postal_code: ['', Validators.required],
      payee_phone_number: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)], // E.164 format
      ],
      payee_email: ['', [Validators.required, Validators.email]],
      currency: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]], // ISO 4217 format
      discount_percent: [0, [Validators.min(0), Validators.max(100)]], // Optional
      tax_percent: [0, [Validators.min(0), Validators.max(100)]], // Optional
      due_amount: [null, [Validators.required, Validators.min(0)]], // Mandatory
    });
  }

  submit(): void {
    if (this.paymentForm.valid) {
      // Prepare the payload
      const formValue = this.paymentForm.getRawValue();
      const paymentData = {
        payee_first_name: formValue.payee_first_name,
        payee_last_name: formValue.payee_last_name,
        payee_payment_status: 'pending', // Ensure always "pending"
        payee_added_date_utc: new Date().toISOString(), // Add current timestamp
        payee_due_date: new Date(formValue.payee_due_date).toISOString(), // Convert to ISO format
        payee_address_line_1: formValue.payee_address_line_1,
        payee_address_line_2: formValue.payee_address_line_2 || "", // Optional field
        payee_city: formValue.payee_city,
        payee_country: formValue.payee_country,
        payee_province_or_state: formValue.payee_province_or_state || "", // Optional field
        payee_postal_code: formValue.payee_postal_code,
        payee_phone_number: formValue.payee_phone_number,
        payee_email: formValue.payee_email,
        currency: formValue.currency,
        discount_percent: formValue.discount_percent,
        tax_percent: formValue.tax_percent,
        due_amount: formValue.due_amount,
        total_due: 0, // Default to 0; server calculates this field
      };

      this.paymentsService.addPayment(paymentData).subscribe({
        next: () => {
          alert('Payment added successfully!');
        },
        error: (err) => {
          console.error('Error adding payment:', err);
        },
      });
    } else {
      alert('Please fill out all required fields.');
    }
  }
}