import { Faq } from '@silknet-ds/react';

export default { title: 'FAQ' };

export const Default = () => (
  <div style={{ maxWidth: 358, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <h1 style={{ marginTop: 0 }}>FAQ</h1>
    <Faq question="რა დრო სჭირდება პორტირებას?" defaultOpen>
      თავად შეგიძლია შეარჩიო პორტირების შესრულებისთვის სასურველი დრო — პორტირების მოთხოვნიდან მინიმუმ 1 და
      მაქსიმუმ 3 სამუშაო დღის ვადაში
    </Faq>
    <Faq question="როგორ შევცვალო ტარიფი?">
      ტარიფის შეცვლა შეგიძლია აპლიკაციაში, „ჩემი სერვისები“ განყოფილებიდან.
    </Faq>
    <Faq question="სად ვნახო ბალანსი?">ბალანსი ჩანს მთავარ გვერდზე.</Faq>
  </div>
);
