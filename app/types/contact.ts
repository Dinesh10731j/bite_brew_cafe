export interface ContactItem {
  id: string;
  icon: any;
  title: string;
  desc: string;
  link?: string;
}

export const initialContactData: ContactItem[] = [
  {
    id: "phone",
    icon: "Phone",
    title: "+1 (555) BREW-123",
    desc: "Call for reservations or questions",
    link: "tel:+15552739123"
  },
  {
    id: "email",
    icon: "Mail",
    title: "hello@bitebrew.cafe",
    desc: "General inquiries & collaborations",
    link: "mailto:hello@bitebrew.cafe"
  },
  {
    id: "address",
    icon: "MapPin",
    title: "Bite Brew Cafe",
    desc: "123 Brew Street\nUrban District, Metropolis",
    link: "https://maps.google.com/?q=Bite+Brew+Cafe,123+Brew+Street"
  },
  {
    id: "hours",
    icon: "Clock",
    title: "Mon-Fri 7AM-11PM",
    desc: "Sat-Sun 8AM-10PM",
    link: undefined
  },
];

