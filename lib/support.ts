export const requestCategories = {
  general: "General enquiry",
  account: "Account & sign-in",
  technical: "Something is not working",
  documents: "Documents & PDF",
  privacy: "Privacy & data",
  premium: "Premium interest",
  feedback: "Feedback & ideas",
} as const;
export type RequestCategory = keyof typeof requestCategories;
export type SupportRequest = {
  id: string;
  category: RequestCategory;
  subject: string;
  message: string;
  status: "open" | "in_review" | "answered" | "closed";
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
};
export function requestCategory(value: string | null): RequestCategory {
  return value && Object.hasOwn(requestCategories, value) ? value as RequestCategory : "general";
}
export const statusLabels = { open: "Received", in_review: "In review", answered: "Replied", closed: "Closed" };
export const faqs = [
  { group: "Account", title: "How do I create a free account?", answer: "Choose Create account, enter your name and email, and set a password of at least 8 characters. Confirm your email using the link in your inbox, then sign in. You can continue with browser drafts while you wait.", href: "/signup", link: "Create a free account" },
  { group: "Account", title: "My confirmation email has not arrived", answer: "Check spam, confirm that you entered the right email address, and use Resend confirmation email on the confirmation screen. If email delivery is unavailable, send an account support request. You do not need an account to contact us.", href: "/contact?category=account", link: "Get account help" },
  { group: "Account", title: "How do I reset my password?", answer: "Open Sign in and choose Forgot password. Request a reset link using your account email. Follow the link to choose a new password. Never share your password or confirmation code in a support request.", href: "/login?mode=reset", link: "Reset password" },
  { group: "Documents", title: "Where are my documents saved?", answer: "Browser drafts stay on the device and browser where you created them. To keep a cloud copy, sign in, open your draft, and choose Save to account. Later edits to account documents need Save changes. Signing in does not automatically upload browser drafts.", href: "/dashboard", link: "Open My documents" },
  { group: "Documents", title: "How do I download a PDF?", answer: "In the editor, choose Print / PDF and select Save as PDF in your browser’s print dialog. Turn off browser headers and footers. Check the page size and every page before saving. On mobile, look for Save as PDF in the print destination menu.", href: "/builder", link: "Open the builder" },
  { group: "Templates", title: "Can I change the template after writing?", answer: "Yes. Open Design in the editor and choose another compatible layout. Your content stays editable. Use the correct document type for your application, and check the live preview before printing.", href: "/templates", link: "Browse templates" },
  { group: "Documents", title: "How can I move a draft to another browser?", answer: "Use Review & export to download an editable JSON backup. On the other browser, open My documents and choose Import backup. A PDF is your final document; a JSON backup is the editable version.", href: "/dashboard", link: "Manage backups" },
  { group: "Plans", title: "What is free, and what is Premium?", answer: "The 12 current templates, guided editor, PDF printing, backups, and account document storage are free. Premium is in planning. You can register interest without payment; submitting a request does not start a subscription or activate paid features.", href: "/pricing", link: "Compare plans" },
  { group: "Privacy", title: "Can support see my documents?", answer: "Contact forms do not attach your documents automatically. Describe the problem without sharing private CV details, passwords, bank information, or identity documents. Project administrators can administer stored data as described in our privacy information.", href: "/privacy", link: "Read privacy information" },
];
