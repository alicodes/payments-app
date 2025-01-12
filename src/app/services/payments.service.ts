import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  /**
   * Fetch payments with filters, sorting, and pagination
   * @param params - Query parameters for search, pagination, etc.
   */
  getPayments(params?: any): Observable<{ data: Payment[]; total: number }> {
    const queryParams = new HttpParams({ fromObject: params });
    return this.http.get<{ data: Payment[]; total: number }>(
      `${this.API_URL}payments/`,
      { params: queryParams }
    );
  }

  /**
   * Add a new payment
   * @param payment - Payment object to be created
   */
  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.API_URL}payments/`, payment);
  }

  /**
   * Update an existing payment
   * @param paymentId - ID of the payment to update
   * @param payment - Partial payment object with fields to update
   */
  updatePayment(paymentId: string, payment: Partial<Payment>): Observable<Payment> {
    return this.http.put<Payment>(`${this.API_URL}payments/${paymentId}/`, payment);
  }

  /**
   * Delete a payment
   * @param paymentId - ID of the payment to delete
   */
  deletePayment(paymentId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}payments/${paymentId}/`);
  }

  /**
   * Upload evidence for a payment
   * @param paymentId - ID of the payment to associate evidence with
   * @param formData - Form data containing the file to upload
   */
  uploadEvidence(paymentId: string, formData: FormData): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}payments/${paymentId}/upload-evidence/`,
      formData
    );
  }

  /**
   * Generate a download link for evidence associated with a payment
   * @param paymentId - ID of the payment for which to get the evidence link
   * @returns A URL string for downloading the evidence file
   */
  getEvidenceDownloadLink(paymentId: string): string {
    return `${this.API_URL}payments/${paymentId}/download-evidence/`;
  }

  /**
   * Download evidence for a payment
   * @param paymentId - ID of the payment for which to download the evidence
   */
  downloadEvidence(paymentId: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}payments/${paymentId}/download-evidence/`, {
      responseType: 'blob',
    });
  }
}
