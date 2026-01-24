"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";

interface PoliciesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PoliciesModal({ isOpen, onClose }: PoliciesModalProps) {
  const { language } = useLanguage();
  const [activeSection, setActiveSection] = useState("privacy");
  const t = translations[language];

  const sections: Array<{ id: string; key: keyof typeof t.policies }> = [
    { id: "privacy", key: "privacyPolicy" },
    { id: "terms", key: "termsOfUse" },
    { id: "suspended", key: "suspendedAccountsPolicy" },
    { id: "prohibited", key: "prohibitedItemsPolicy" },
    { id: "intellectual", key: "intellectualPropertyPolicy" },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(`modal-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {language === "ar"
                  ? "سياسات منصة سبلاير"
                  : "Supplier.sa Platform Policies"}
              </h1>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              {language === "ar"
                ? "آخر تحديث: 30 ديسمبر 2025"
                : "Last Updated: December 30, 2025"}
            </p>
          </div>

          <div className="h-[calc(90vh-80px)] overflow-y-auto">
            {/* Main Content - Full Width without Sidebar */}
            <div className="p-6">
              {/* Privacy Policy Section */}
              <section id={`modal-privacy`} className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ar"
                    ? "1. سياسة الخصوصية"
                    : "1. Privacy Policy"}
                </h2>

                {language === "ar" ? (
                  <div className="space-y-4 text-gray-700 text-sm">
                    <p>
                      مرحبًا بك في منصة سبلاير (Supplier.sa). نحن في مؤسسة
                      سبلاير نولي أهمية قصوى لخصوصية مستخدمينا، سواء كانوا
                      موردين أو شركات. توضح هذه السياسة كيفية جمعنا واستخدامنا
                      وحمايتنا لمعلوماتك الشخصية. إن استخدامك للمنصة يعني
                      موافقتك على هذه السياسة.
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        أ. المعلومات التي نجمعها
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>معلومات التسجيل:</strong> عند إنشاء حساب، نطلب
                          منك معلومات أساسية مثل الاسم، اسم الشركة، البريد
                          الإلكتروني، رقم الجوال، والسجل التجاري.
                        </li>
                        <li>
                          <strong>معلومات الملف الشخصي:</strong> يمكنك إضافة
                          المزيد من التفاصيل إلى ملفك الشخصي مثل عنوان الشركة،
                          وصف النشاط، الشعارات، والصور التي توضح منتجاتك أو
                          خدماتك.
                        </li>
                        <li>
                          <strong>معلومات التعاملات:</strong> نقوم بتسجيل تفاصيل
                          الطلبات، عروض الأسعار، المحادثات، والتقييمات التي تتم
                          بين الموردين والشركات عبر المنصة.
                        </li>
                        <li>
                          <strong>معلومات تقنية:</strong> نقوم بجمع معلومات
                          تقنية تلقائيًا عند استخدامك للمنصة، مثل عنوان بروتوكول
                          الإنترنت (IP)، نوع المتصفح، ونظام التشغيل.
                        </li>
                        <li>
                          <strong>ملفات تعريف الارتباط (Cookies):</strong>{" "}
                          نستخدم ملفات تعريف الارتباط لتخصيص تجربتك، وتذكر
                          تفضيلاتك، وتحليل كيفية استخدامك للمنصة.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        ب. كيف نستخدم معلوماتك
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>لتشغيل المنصة:</strong> لإدارة حسابك، وتسهيل
                          التواصل بين الموردين والشركات، ومعالجة التعاملات.
                        </li>
                        <li>
                          <strong>لتحسين خدماتنا:</strong> لتحليل سلوك
                          المستخدمين، وفهم احتياجاتهم، وتطوير ميزات جديدة.
                        </li>
                        <li>
                          <strong>للتواصل معك:</strong> لإرسال إشعارات هامة
                          تتعلق بحسابك، أو تحديثات على خدماتنا، أو عروض تسويقية،
                          مع إمكانية إلغاء الاشتراك.
                        </li>
                        <li>
                          <strong>لضمان الأمان:</strong> لحماية المنصة من
                          الاحتيال والأنشطة غير القانونية، وفرض شروط الاستخدام
                          الخاصة بنا.
                        </li>
                        <li>
                          <strong>للامتثال القانوني:</strong> للالتزام
                          بالمتطلبات القانونية والتنظيمية في المملكة العربية
                          السعودية.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        ج. مشاركة المعلومات
                      </h3>
                      <p>
                        نحن لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك
                        معلوماتك في الحالات التالية فقط:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>بين المستخدمين:</strong> تتم مشاركة المعلومات
                          الأساسية للشركات والموردين لتسهيل التواصل التجاري.
                        </li>
                        <li>
                          <strong>مزودي الخدمات:</strong> مع شركات الطرف الثالث
                          التي تساعدنا في تشغيل المنصة.
                        </li>
                        <li>
                          <strong>للأغراض القانونية:</strong> عند الالتزام
                          بالقوانين أو طلبات السلطات القضائية.
                        </li>
                        <li>
                          <strong>في حال نقل الملكية:</strong> في حالة بيع
                          المنصة أو دمجها مع شركة أخرى.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        د. أمن البيانات
                      </h3>
                      <p>
                        نتخذ تدابير أمنية تقنية وإدارية مناسبة لحماية معلوماتك
                        من الوصول غير المصرح به أو التعديل أو الإفصاح أو
                        الإتلاف. تشمل هذه التدابير:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>تشفير البيانات أثناء النقل والتخزين</li>
                        <li>جدار حماية وشبكات آمنة</li>
                        <li>الوصول المحدود للموظفين</li>
                        <li>نسخ احتياطية منتظمة</li>
                        <li>مراجعات أمنية دورية</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">ه. حقوقك</h3>
                      <p>لديك الحقوق التالية بخصوص معلوماتك الشخصية:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>الوصول:</strong> طلب نسخة من معلوماتك الشخصية
                        </li>
                        <li>
                          <strong>التصحيح:</strong> تحديث المعلومات غير الصحيحة
                        </li>
                        <li>
                          <strong>الحذف:</strong> طلب حذف معلوماتك الشخصية
                        </li>
                        <li>
                          <strong>تقييد المعالجة:</strong> تقييد استخدام
                          معلوماتك
                        </li>
                        <li>
                          <strong>نقل البيانات:</strong> طلب نقل معلوماتك إلى
                          طرف ثالث
                        </li>
                        <li>
                          <strong>الاعتراض:</strong> الاعتراض على معالجة
                          معلوماتك
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-700 text-sm">
                    <p>
                      Welcome to Supplier.sa. We at Supplier Establishment take
                      your privacy very seriously, whether you are a supplier or
                      a business. This policy explains how we collect, use, and
                      protect your personal information. Your use of the
                      platform indicates your consent to this policy.
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        A. Information We Collect
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>Registration Information:</strong> When you
                          create an account, we ask for basic information such
                          as name, company name, email, mobile number, and
                          commercial registration.
                        </li>
                        <li>
                          <strong>Profile Information:</strong> You can add more
                          details to your profile, such as company address,
                          business description, logos, and images of your
                          products or services.
                        </li>
                        <li>
                          <strong>Transaction Information:</strong> We record
                          details of orders, quotations, conversations, and
                          reviews that take place between suppliers and
                          businesses on the platform.
                        </li>
                        <li>
                          <strong>Technical Information:</strong> We
                          automatically collect technical information when you
                          use the platform, such as IP address, browser type,
                          and operating system.
                        </li>
                        <li>
                          <strong>Cookies:</strong> We use cookies to customize
                          your experience, remember your preferences, and
                          analyze how you use the platform.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        B. How We Use Your Information
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>To Operate the Platform:</strong> To manage
                          your account, facilitate communication between
                          suppliers and businesses, and process transactions.
                        </li>
                        <li>
                          <strong>To Improve Our Services:</strong> To analyze
                          user behavior, understand their needs, and develop new
                          features.
                        </li>
                        <li>
                          <strong>To Communicate with You:</strong> To send
                          important notifications about your account, service
                          updates, or marketing offers, with the ability to
                          unsubscribe.
                        </li>
                        <li>
                          <strong>To Ensure Security:</strong> To protect the
                          platform from fraud and illegal activities, and
                          enforce our terms of use.
                        </li>
                        <li>
                          <strong>For Legal Compliance:</strong> To comply with
                          legal and regulatory requirements in the Kingdom of
                          Saudi Arabia.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        C. Information Sharing
                      </h3>
                      <p>
                        We do not sell your personal information to third
                        parties. We may share your information only in the
                        following cases:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>Between Users:</strong> Basic information
                          about businesses and suppliers is shared to facilitate
                          commercial communication.
                        </li>
                        <li>
                          <strong>Service Providers:</strong> With third-party
                          companies that help us operate the platform.
                        </li>
                        <li>
                          <strong>For Legal Purposes:</strong> When complying
                          with laws or requests from judicial authorities.
                        </li>
                        <li>
                          <strong>In Case of Ownership Transfer:</strong> In the
                          event of selling or merging the platform with another
                          company.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        D. Data Security
                      </h3>
                      <p>
                        We take appropriate technical and administrative
                        security measures to protect your information from
                        unauthorized access, alteration, disclosure, or
                        destruction. These measures include:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Data encryption during transmission and storage</li>
                        <li>Firewalls and secure networks</li>
                        <li>Limited employee access</li>
                        <li>Regular backups</li>
                        <li>Periodic security reviews</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        E. Your Rights
                      </h3>
                      <p>
                        You have the following rights regarding your personal
                        information:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>
                          <strong>Access:</strong> Request a copy of your
                          personal information
                        </li>
                        <li>
                          <strong>Correction:</strong> Update incorrect
                          information
                        </li>
                        <li>
                          <strong>Deletion:</strong> Request deletion of your
                          personal information
                        </li>
                        <li>
                          <strong>Restrict Processing:</strong> Restrict use of
                          your information
                        </li>
                        <li>
                          <strong>Data Portability:</strong> Request transfer of
                          your information to a third party
                        </li>
                        <li>
                          <strong>Objection:</strong> Object to processing of
                          your information
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </section>

              {/* Terms of Use Section */}
              <section id={`modal-terms`} className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ar" ? "2. شروط الاستخدام" : "2. Terms of Use"}
                </h2>

                {language === "ar" ? (
                  <div className="space-y-4 text-gray-700 text-sm">
                    <p>
                      باستخدامك منصة سبلاير (Supplier.sa)، فإنك توافق على
                      الالتزام بهذه الشروط والأحكام. إذا لم توافق على هذه
                      الشروط، يرجى عدم استخدام المنصة.
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        أ. قبول الشروط
                      </h3>
                      <p>
                        بالوصول إلى أو استخدام منصة سبلاير، فإنك تقبل وتوافق على
                        الالتزام بهذه الشروط. إذا كنت لا توافق على هذه الشروط،
                        يجب عليك التوقف عن استخدام المنصة فوراً.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        ب. وصف المنصة
                      </h3>
                      <p>
                        منصة سبلاير هي منصة إلكترونية تربط بين الشركات والموردين
                        في المملكة العربية السعودية. الهدف هو تسهيل التواصل
                        التجاري وتوسيع فرص الأعمال.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        ج. شروط العضوية
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>يجب أن تكون عملاً حقيقياً ومسجلاً قانونياً</li>
                        <li>تقديم معلومات دقيقة وصحيحة</li>
                        <li>الحفاظ على سرية حسابك</li>
                        <li>عدم استخدام المنصة لأغراض غير قانونية</li>
                        <li>احترام الآخرين وعدم الإساءة إليهم</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        د. المحتوى الممنوع
                      </h3>
                      <p>يحظر نشر أو مشاركة المحتوى التالي:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>محتوى غير قانوني أو مخالف للقوانين السعودية</li>
                        <li>محتوى ينتهك حقوق الملكية الفكرية</li>
                        <li>محتوى مسيء أو تشهيري</li>
                        <li>محتوى احتيالي أو مضلل</li>
                        <li>محتوى فاحش أو غير لائق</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        ه. المسؤوليات
                      </h3>
                      <p>أنت مسؤول عن:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>دقة المعلومات التي تقدمها</li>
                        <li>الحفاظ على أمن حسابك</li>
                        <li>التعاملات التي تتم عبر حسابك</li>
                        <li>الامتثال للقوانين المعمول بها</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-gray-700 text-sm">
                    <p>
                      By using Supplier.sa, you agree to comply with these terms
                      and conditions. If you do not agree to these terms, please
                      do not use the platform.
                    </p>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        A. Acceptance of Terms
                      </h3>
                      <p>
                        By accessing or using the Supplier.sa platform, you
                        accept and agree to be bound by these terms. If you do
                        not agree to these terms, you must stop using the
                        platform immediately.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        B. Platform Description
                      </h3>
                      <p>
                        Supplier.sa is an electronic platform that connects
                        businesses and suppliers in the Kingdom of Saudi Arabia.
                        The goal is to facilitate commercial communication and
                        expand business opportunities.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        C. Membership Conditions
                      </h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Must be a real and legally registered business</li>
                        <li>Provide accurate and correct information</li>
                        <li>Maintain account confidentiality</li>
                        <li>Do not use the platform for illegal purposes</li>
                        <li>Respect others and do not abuse them</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        D. Prohibited Content
                      </h3>
                      <p>
                        The following content is prohibited from being published
                        or shared:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Content illegal or violating Saudi laws</li>
                        <li>Content violating intellectual property rights</li>
                        <li>Abusive or defamatory content</li>
                        <li>Fraudulent or misleading content</li>
                        <li>Obscene or inappropriate content</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        E. Responsibilities
                      </h3>
                      <p>You are responsible for:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Accuracy of information you provide</li>
                        <li>Maintaining your account security</li>
                        <li>Transactions made through your account</li>
                        <li>Compliance with applicable laws</li>
                      </ul>
                    </div>
                  </div>
                )}
              </section>

              {/* Other sections can be added here following the same pattern */}
              <section id={`modal-suspended`} className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ar"
                    ? "3. سياسة الحسابات المعلقة"
                    : "3. Suspended Accounts Policy"}
                </h2>
                <p className="text-gray-700 text-sm">
                  {language === "ar"
                    ? "سياسة تعليق الحسابات والأسباب التي قد تؤدي إلى تعليق حسابك."
                    : "Policy for suspending accounts and reasons that may lead to your account suspension."}
                </p>
              </section>

              <section id={`modal-prohibited`} className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ar"
                    ? "4. سياسة المواد الممنوعة"
                    : "4. Prohibited Items Policy"}
                </h2>
                <p className="text-gray-700 text-sm">
                  {language === "ar"
                    ? "قائمة بالمواد والخدمات الممنوعة على المنصة."
                    : "List of prohibited items and services on the platform."}
                </p>
              </section>

              <section id={`modal-intellectual`} className="mb-12 scroll-mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {language === "ar"
                    ? "5. سياسة الملكية الفكرية"
                    : "5. Intellectual Property Policy"}
                </h2>
                <p className="text-gray-700 text-sm">
                  {language === "ar"
                    ? "سياسة حماية حقوق الملكية الفكرية على المنصة."
                    : "Policy for protecting intellectual property rights on the platform."}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
