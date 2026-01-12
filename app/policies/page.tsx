"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { translations } from "@/lib/translations";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PoliciesPage() {
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
    const element = document.getElementById(sectionId);
    if (element) {
      const h2Element = element.querySelector("h2");
      if (h2Element) {
        const rect = h2Element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - 100; // 100px offset from top
        window.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const element = document.getElementById(activeSection);
    if (element) {
      const h2Element = element.querySelector("h2");
      if (h2Element) {
        const rect = h2Element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top - 100; // 100px offset from top
        window.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        });
      }
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {language === "ar"
                  ? "سياسات منصة سبلاير"
                  : "Supplier.sa Platform Policies"}
              </h1>
              <p className="text-gray-600">
                {language === "ar"
                  ? "آخر تحديث: 30 ديسمبر 2025"
                  : "Last Updated: December 30, 2025"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === "ar" ? "المحتويات" : "Contents"}
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-right lg:text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeSection === section.id
                          ? "bg-yellow-100 text-yellow-800 border-r-2 border-yellow-400"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {t.policies[section.key] as string}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                {/* Privacy Policy Section */}
                <section id="privacy" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "ar"
                      ? "1. سياسة الخصوصية"
                      : "1. Privacy Policy"}
                  </h2>

                  {language === "ar" ? (
                    <div className="space-y-6 text-gray-700">
                      <p>
                        مرحبًا بك في منصة سبلاير (Supplier.sa). نحن في مؤسسة
                        سبلاير نولي أهمية قصوى لخصوصية مستخدمينا، سواء كانوا
                        موردين أو شركات. توضح هذه السياسة كيفية جمعنا واستخدامنا
                        وحمايتنا لمعلوماتك الشخصية. إن استخدامك للمنصة يعني
                        موافقتك على هذه السياسة.
                      </p>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          أ. المعلومات التي نجمعها
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>
                            <strong>معلومات التسجيل:</strong> عند إنشاء حساب،
                            نطلب منك معلومات أساسية مثل الاسم، اسم الشركة،
                            البريد الإلكتروني، رقم الجوال، والسجل التجاري.
                          </li>
                          <li>
                            <strong>معلومات الملف الشخصي:</strong> يمكنك إضافة
                            المزيد من التفاصيل إلى ملفك الشخصي مثل عنوان الشركة،
                            وصف النشاط، الشعارات، والصور التي توضح منتجاتك أو
                            خدماتك.
                          </li>
                          <li>
                            <strong>معلومات التعاملات:</strong> نقوم بتسجيل
                            تفاصيل الطلبات، عروض الأسعار، المحادثات، والتقييمات
                            التي تتم بين الموردين والشركات عبر المنصة.
                          </li>
                          <li>
                            <strong>معلومات تقنية:</strong> نقوم بجمع معلومات
                            تقنية تلقائيًا عند استخدامك للمنصة، مثل عنوان
                            بروتوكول الإنترنت (IP)، نوع المتصفح، ونظام التشغيل.
                          </li>
                          <li>
                            <strong>ملفات تعريف الارتباط (Cookies):</strong>{" "}
                            نستخدم ملفات تعريف الارتباط لتخصيص تجربتك، وتذكر
                            تفضيلاتك، وتحليل كيفية استخدامك للمنصة.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
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
                            تتعلق بحسابك، أو تحديثات على خدماتنا، أو عروض
                            تسويقية، مع إمكانية إلغاء الاشتراك.
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
                        <h3 className="text-lg font-semibold mb-3">
                          ج. مشاركة المعلومات
                        </h3>
                        <p>
                          نحن لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك
                          معلوماتك في الحالات التالية فقط:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>
                            <strong>بين المستخدمين:</strong> تتم مشاركة
                            المعلومات الضرورية مثل اسم الشركة وتفاصيل الاتصال
                            بين المورد والشركة لإتمام التعاملات التجارية بينهما.
                          </li>
                          <li>
                            <strong>مزودو الخدمات:</strong> قد نستعين بأطراف
                            ثالثة لمعالجة المدفوعات، تحليل البيانات، أو تقديم
                            خدمات الدعم الفني.
                          </li>
                          <li>
                            <strong>الجهات الحكومية:</strong> قد نكشف عن
                            معلوماتك إذا طُلب منا ذلك بموجب أمر قضائي أو قانوني.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          د. أمان المعلومات
                        </h3>
                        <p>
                          نتخذ إجراءات أمنية تقنية وتنظيمية لحماية معلوماتك من
                          الوصول غير المصرح به. ومع ذلك، لا توجد طريقة نقل عبر
                          الإنترنت آمنة بنسبة 100%، لذا لا يمكننا ضمان الأمان
                          المطلق.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          هـ. حقوقك
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>
                            <strong>الوصول والتعديل:</strong> يمكنك مراجعة
                            وتحديث معلوماتك الشخصية في أي وقت من خلال لوحة
                            التحكم في حسابك.
                          </li>
                          <li>
                            <strong>طلب الحذف:</strong> يمكنك طلب حذف حسابك، مع
                            العلم أننا قد نحتفظ ببعض المعلومات لأغراض قانونية.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          و. التواصل معنا
                        </h3>
                        <p>
                          إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل
                          معنا عبر البريد الإلكتروني:
                          <br />
                          <a
                            href="mailto:info@supplier.sa"
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            info@supplier.sa
                          </a>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-gray-700">
                      <p>
                        Welcome to the Supplier.sa platform. At the Supplier
                        Establishment, we prioritize the privacy of our users,
                        whether they are suppliers or companies. This policy
                        explains how we collect, use, and protect your personal
                        information. Your use of the platform signifies your
                        agreement to this policy.
                      </p>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
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
                            <strong>Profile Information:</strong> You can add
                            more details to your profile, such as company
                            address, business description, logos, and images of
                            your products or services.
                          </li>
                          <li>
                            <strong>Transaction Information:</strong> We record
                            details of orders, quotes, conversations, and
                            ratings between suppliers and companies on the
                            platform.
                          </li>
                          <li>
                            <strong>Technical Information:</strong> We
                            automatically collect technical information like
                            your IP address, browser type, and operating system.
                          </li>
                          <li>
                            <strong>Cookies:</strong> We use cookies to
                            personalize your experience, remember your
                            preferences, and analyze platform usage.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          B. How We Use Your Information
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>
                            <strong>To Operate the Platform:</strong> To manage
                            your account, facilitate communication, and process
                            transactions.
                          </li>
                          <li>
                            <strong>To Improve Our Services:</strong> To analyze
                            user behavior, understand needs, and develop new
                            features.
                          </li>
                          <li>
                            <strong>To Communicate With You:</strong> To send
                            important account notifications, service updates, or
                            marketing offers, with an unsubscribe option.
                          </li>
                          <li>
                            <strong>To Ensure Security:</strong> To protect
                            against fraud, illegal activities, and enforce our
                            Terms of Use.
                          </li>
                          <li>
                            <strong>For Legal Compliance:</strong> To adhere to
                            the legal and regulatory requirements in the Kingdom
                            of Saudi Arabia.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          C. Information Sharing
                        </h3>
                        <p>
                          We do not sell your personal information. We may share
                          your information only in these cases:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>
                            <strong>Between Users:</strong> Necessary
                            information such as company name and contact details
                            is shared between suppliers and companies to
                            complete transactions.
                          </li>
                          <li>
                            <strong>Service Providers:</strong> We may use third
                            parties for payment processing, data analysis, or
                            technical support.
                          </li>
                          <li>
                            <strong>Government Authorities:</strong> We may
                            disclose your information if required by a court or
                            legal order.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          D. Information Security
                        </h3>
                        <p>
                          We implement technical and organizational security
                          measures to protect your information from unauthorized
                          access. However, no internet transmission is 100%
                          secure, and we cannot guarantee absolute security.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          E. Your Rights
                        </h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>
                            <strong>Access and Correction:</strong> You can
                            review and update your personal information at any
                            time from your account dashboard.
                          </li>
                          <li>
                            <strong>Request Deletion:</strong> You can request
                            the deletion of your account, noting that we may
                            retain some information for legal purposes.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          F. Contact Us
                        </h3>
                        <p>
                          If you have any questions about this Privacy Policy,
                          please contact us via email:
                          <br />
                          <a
                            href="mailto:info@supplier.sa"
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            info@supplier.sa
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Terms of Use Section */}
                <section id="terms" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "ar"
                      ? "2. شروط الاستخدام"
                      : "2. Terms of Use"}
                  </h2>

                  {language === "ar" ? (
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          أ. أهلية العضوية
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>
                            يجب أن يكون المستخدم كيانًا تجاريًا مسجلاً رسميًا.
                          </li>
                          <li>
                            يجب تقديم معلومات صحيحة وكاملة ودقيقة عند التسجيل.
                          </li>
                          <li>
                            يحق لمنصة سبلاير إلغاء أي حساب يستخدم معلومات مزيفة.
                          </li>
                          <li>
                            يُمنع أن يكون للكيان التجاري أكثر من حساب واحد في
                            المنصة.
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          ب. التزاماتك كعضو
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>
                            أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة
                            المرور.
                          </li>
                          <li>
                            تتعهد بعدم استخدام المنصة لأي غرض غير قانوني أو
                            محظور.
                          </li>
                          <li>
                            تتعهد بعدم الإضرار بالمنصة أو بمستخدميها الآخرين.
                          </li>
                          <li>
                            تتعهد بتقديم معلومات واضحة وصحيحة عن المنتجات أو
                            الخدمات التي تعرضها.
                          </li>
                          <li>
                            تتعهد بالالتزام بجميع القوانين واللوائح المعمول بها
                            في المملكة العربية السعودية.
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          ج. طبيعة العلاقة
                        </h3>
                        <p>
                          منصة سبلاير هي وسيط تقني يربط بين الموردين والشركات.
                          المنصة ليست طرفًا في أي عقد أو اتفاق يتم بين
                          المستخدمين ولا تتحمل أي مسؤولية عن جودة المنتجات أو
                          سداد المستحقات.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          A. Membership Eligibility
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>
                            The user must be an officially registered commercial
                            entity.
                          </li>
                          <li>
                            You must provide true, complete, and accurate
                            information upon registration.
                          </li>
                          <li>
                            Supplier.sa has the right to cancel any account
                            using false information.
                          </li>
                          <li>
                            An entity is prohibited from having more than one
                            account on the platform.
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          B. Your Obligations as a Member
                        </h3>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                          <li>
                            You are responsible for maintaining the
                            confidentiality of your account information and
                            password.
                          </li>
                          <li>
                            You agree not to use the platform for any illegal or
                            prohibited purpose.
                          </li>
                          <li>
                            You agree not to harm the platform or its other
                            users.
                          </li>
                          <li>
                            You agree to provide clear and accurate information
                            about the products or services you offer.
                          </li>
                          <li>
                            You agree to comply with all applicable laws and
                            regulations in the Kingdom of Saudi Arabia.
                          </li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          C. Nature of the Relationship
                        </h3>
                        <p>
                          Supplier.sa is a technical intermediary connecting
                          suppliers and companies. The platform is not a party
                          to any contract between users and is not responsible
                          for product quality or payments.
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Suspended Accounts Section */}
                <section id="suspended" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "ar"
                      ? "3. سياسة الحسابات الموقوفة"
                      : "3. Suspended Accounts Policy"}
                  </h2>

                  {language === "ar" ? (
                    <div className="space-y-4 text-gray-700">
                      <p>
                        تحتفظ إدارة منصة سبلاير بالحق في حظر أو تعليق أي حساب في
                        الحالات التالية:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>انتهاك شروط الاستخدام أو أي من السياسات الأخرى.</li>
                        <li>
                          الاحتيال أو التلاعب أو محاولة التحايل على أنظمة
                          المنصة.
                        </li>
                        <li>عرض أو طلب مواد مدرجة في قائمة المواد المحظورة.</li>
                        <li>
                          الإضرار بالمستخدمين الآخرين أو عدم الالتزام بالاتفاقات
                          التجارية.
                        </li>
                        <li>انتحال شخصية أو صفة كيان تجاري آخر.</li>
                        <li>تلقي شكاوى موثقة ومتكررة من مستخدمين آخرين.</li>
                      </ol>
                    </div>
                  ) : (
                    <div className="space-y-4 text-gray-700">
                      <p>
                        The Supplier.sa administration reserves the right to
                        block or suspend any account for the following reasons:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>
                          Violation of the Terms of Use or any other policies.
                        </li>
                        <li>
                          Fraud, manipulation, or attempting to cheat the
                          platform's systems.
                        </li>
                        <li>
                          Listing or requesting items from the Prohibited Items
                          list.
                        </li>
                        <li>
                          Harming other users or failing to honor business
                          agreements.
                        </li>
                        <li>Impersonating another business entity.</li>
                        <li>
                          Receiving multiple, documented complaints from other
                          users.
                        </li>
                      </ol>
                    </div>
                  )}
                </section>

                {/* Prohibited Items Section */}
                <section id="prohibited" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "ar"
                      ? "4. سياسة المواد والخدمات المحظورة"
                      : "4. Prohibited Items and Services Policy"}
                  </h2>

                  {language === "ar" ? (
                    <div className="space-y-4 text-gray-700">
                      <p>
                        يُمنع منعًا باتًا عرض أو طلب أي من المواد أو الخدمات
                        التالية على المنصة:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>
                          جميع المنتجات والخدمات غير القانونية بموجب قوانين
                          المملكة العربية السعودية.
                        </li>
                        <li>الأسلحة النارية والذخائر والمتفجرات.</li>
                        <li>المخدرات والمؤثرات العقلية والمسكرات.</li>
                        <li>
                          المنتجات المقلدة أو التي تنتهك حقوق الملكية الفكرية.
                        </li>
                        <li>الأدوية والمنتجات الطبية التي تتطلب وصفة طبية.</li>
                        <li>المنتجات الغذائية الفاسدة أو منتهية الصلاحية.</li>
                        <li>خدمات النصب والاحتيال أو التسويق الهرمي.</li>
                        <li>
                          أي منتجات أو خدمات تعتبرها إدارة المنصة غير أخلاقية أو
                          غير مناسبة.
                        </li>
                      </ol>
                    </div>
                  ) : (
                    <div className="space-y-4 text-gray-700">
                      <p>
                        It is strictly forbidden to list or request any of the
                        following items or services on the platform:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>
                          All products and services illegal under the laws of
                          the Kingdom of Saudi Arabia.
                        </li>
                        <li>Firearms, ammunition, and explosives.</li>
                        <li>
                          Drugs, psychotropic substances, and intoxicants.
                        </li>
                        <li>
                          Counterfeit products or those that infringe on
                          intellectual property rights.
                        </li>
                        <li>
                          Medications and medical products requiring a
                          prescription.
                        </li>
                        <li>Spoiled or expired food products.</li>
                        <li>Scam services or pyramid schemes.</li>
                        <li>
                          Any products or services the platform administration
                          deems unethical or inappropriate.
                        </li>
                      </ol>
                    </div>
                  )}
                </section>

                {/* Intellectual Property Section */}
                <section id="intellectual" className="mb-12 scroll-mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {language === "ar"
                      ? "5. سياسة الملكية الفكرية"
                      : "5. Intellectual Property Policy"}
                  </h2>

                  {language === "ar" ? (
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          6. ملكية المنصة
                        </h3>
                        <p>
                          العلامة التجارية سبلاير (Supplier.sa) وجميع الشعارات
                          والتصاميم والنصوص والبرمجيات المرتبطة بالمنصة هي ملك
                          حصري لمؤسسة سبلاير.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          7. محتوى المستخدم
                        </h3>
                        <p>
                          أنت تمنح منصة سبلاير ترخيصًا عالميًا وغير حصري
                          لاستخدام وعرض المحتوى الذي تقوم بنشره، مثل صور
                          المنتجات، لغرض تشغيل وترويج المنصة.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          8. احترام حقوق الآخرين
                        </h3>
                        <p>
                          تتعهد بأن جميع المواد التي ترفعها على المنصة هي ملكك
                          الخاص أو لديك الحق في استخدامها، وأنها لا تنتهك حقوق
                          الملكية الفكرية لأي طرف ثالث.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          9. الإبلاغ عن الانتهاكات
                        </h3>
                        <p>
                          إذا كنت تعتقد أن أحد المستخدمين قد انتهك حقوق الملكية
                          الفكرية الخاصة بك، يرجى التواصل معنا فورًا مع تقديم ما
                          يثبت ذلك.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 text-gray-700">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          6. Platform Ownership
                        </h3>
                        <p>
                          The Supplier (Supplier.sa) trademark and all
                          associated logos, designs, text, and software are the
                          exclusive property of the Supplier Establishment.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          7. User Content
                        </h3>
                        <p>
                          You grant Supplier.sa a worldwide, non-exclusive
                          license to use and display the content you post, such
                          as product images, for the purpose of operating and
                          promoting the platform.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          8. Respect for Others' Rights
                        </h3>
                        <p>
                          You confirm that all materials you upload are your own
                          or that you have the right to use them, and they do
                          not infringe on any third-party intellectual property
                          rights.
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          9. Reporting Infringements
                        </h3>
                        <p>
                          If you believe a user has violated your intellectual
                          property rights, please contact us immediately with
                          proof.
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
