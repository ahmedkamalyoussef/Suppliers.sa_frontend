'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../lib/LanguageContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function PaymentComplete() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'processing'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tapId = searchParams?.get('tap_id');
  const data = searchParams?.get('data');

  useEffect(() => {
    if (!tapId) {
      setError('No payment ID found');
      setPaymentStatus('failed');
      setLoading(false);
      return;
    }

    verifyPayment();
  }, [tapId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/payment/success?tap_id=${tapId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setPaymentDetails(result.data);
        
        // Check if payment is actually paid
        if (result.data.is_paid) {
          setPaymentStatus('success');
        } else {
          // If not paid, check if there are other recent payments for this user
          await checkRecentPayments();
        }
      } else {
        setError(result.message || 'Payment verification failed');
        setPaymentStatus('failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const checkRecentPayments = async () => {
    try {
      // Check if user has any successful recent payments
      const token = localStorage.getItem("supplier_token");
      if (!token) return;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"}/payment/recent`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      
      if (result.success && result.data && result.data.length > 0) {
        const latestPayment = result.data[0];
        if (latestPayment.is_paid) {
          setPaymentDetails(latestPayment);
          setPaymentStatus('success');
          return;
        }
      }
      
      // If no successful payments found, keep as processing
      setPaymentStatus('processing');
    } catch (err) {
      console.error('Error checking recent payments:', err);
      setPaymentStatus('processing');
    }
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  const handleGoToSubscription = () => {
    router.push('/subscription');
  };

  const handleTryAgain = () => {
    router.push('/subscription');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'جاري التحقق من الدفع...' : 'Verifying payment...'}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === 'ar' ? 'يرجى الانتظار بينما نتحقق من حالة الدفع الخاص بك' : 'Please wait while we verify your payment status'}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                {language === 'ar' ? '🔍 معرف الدفع:' : '🔍 Payment ID:'} {tapId}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full">
          
          {paymentStatus === 'success' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'تم الدفع بنجاح!' : 'Payment Successful!'}
              </h1>
              
              <p className="text-gray-600 mb-8">
                {language === 'ar' 
                  ? 'شكراً لك! تم تفعيل اشتراكك بنجاح ويمكنك الآن الاستمتاع بجميع الميزات المميزة.'
                  : 'Thank you! Your subscription has been successfully activated and you can now enjoy all premium features.'
                }
              </p>

              {/* Payment Details */}
              {paymentDetails && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {language === 'ar' ? 'تفاصيل الدفع' : 'Payment Details'}
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'معرف الدفع' : 'Payment ID'}
                      </span>
                      <span className="font-medium text-gray-900">{paymentDetails.tap_id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'المبلغ' : 'Amount'}
                      </span>
                      <span className="font-medium text-gray-900">
                        {paymentDetails.amount} {paymentDetails.currency}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">
                        {language === 'ar' ? 'الحالة' : 'Status'}
                      </span>
                      <span className="font-medium text-green-600">
                        {language === 'ar' ? 'مدفوع' : 'Paid'}
                      </span>
                    </div>
                    {paymentDetails.paid_at && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">
                          {language === 'ar' ? 'وقت الدفع' : 'Paid At'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {new Date(paymentDetails.paid_at).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleGoToDashboard}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
                </button>
                
                <button
                  onClick={handleGoToSubscription}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                >
                  {language === 'ar' ? 'عرض الباقات' : 'View Plans'}
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Processing Icon */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
                <svg className="h-12 w-12 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'جاري معالجة الدفع' : 'Processing Payment'}
              </h1>
              
              <p className="text-gray-600 mb-8">
                {language === 'ar' 
                  ? 'دفعك قيد المعالجة. قد يستغرق هذا بضع دقائق. سيتم تحديث الصفحة تلقائياً عند اكتمال المعالجة.'
                  : 'Your payment is being processed. This may take a few minutes. The page will update automatically when processing is complete.'
                }
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                <p className="text-yellow-800 text-sm">
                  {language === 'ar' 
                    ? '💡 نصيحة: يمكنك إغلاق هذه الصفحة والعودة لاحقاً. سيتم إشعارك عبر البريد الإلكتروني عند اكتمال المعالجة.'
                    : '💡 Tip: You can close this page and check back later. You will be notified via email when processing is complete.'
                  }
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {language === 'ar' ? 'تحقق الآن' : 'Check Now'}
                </button>
                
                <button
                  onClick={handleGoToSubscription}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                >
                  {language === 'ar' ? 'العودة للباقات' : 'Back to Plans'}
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              {/* Failed Icon */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {language === 'ar' ? 'فشل الدفع' : 'Payment Failed'}
              </h1>
              
              <p className="text-gray-600 mb-8">
                {error || (language === 'ar' 
                  ? 'لم نتمكن من التحقق من دفعك. يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.'
                  : 'We couldn\'t verify your payment. Please try again or contact support.'
                )}
              </p>

              {/* Debug Info */}
              {tapId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {language === 'ar' ? 'معلومات للتصحيح' : 'Debug Info'}
                  </h3>
                  <div className="text-xs text-gray-600 space-y-1 font-mono">
                    <div>TAP ID: {tapId}</div>
                    {data && <div>Data: {data.substring(0, 50)}...</div>}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleTryAgain}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {language === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
                </button>
                
                <button
                  onClick={handleGoToSubscription}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                >
                  {language === 'ar' ? 'العودة للباقات' : 'Back to Plans'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
