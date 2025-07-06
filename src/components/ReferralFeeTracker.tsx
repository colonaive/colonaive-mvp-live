import React from 'react';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { DollarSign, FileText, AlertCircle } from 'lucide-react';

interface Referral {
  patient: string;
  date: string;
  status: "Pending" | "Test Done" | "Consult Only" | "No Show";
}

interface Props {
  referrals: Referral[];
  platformFee: number;
}

export default function ReferralFeeTracker({ referrals, platformFee }: Props) {
  const billable = referrals.filter((r) => r.status === "Test Done" || r.status === "Consult Only");
  const totalDue = billable.length * platformFee;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-white">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Fee Summary</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Billable Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{billable.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Fee Per Referral</p>
                <p className="text-2xl font-bold text-gray-900">${platformFee.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Total Amount Due</h3>
              </div>
              <p className="text-3xl font-bold text-blue-700">${totalDue.toFixed(2)}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Fee Structure</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Platform fees apply to completed consultations</li>
                    <li>• Includes "Test Done" and "Consult Only" statuses</li>
                    <li>• No fees for "Pending" or "No Show" referrals</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" className="mr-2">Download Statement</Button>
              <Button>Process Payment</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}