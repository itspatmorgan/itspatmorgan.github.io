export interface Commendation {
  name: string;
  role: string;
  quote: string;
}

export const commendations: Commendation[] = [
  {
    name: "David Hoang",
    role: "VP Design @ Atlassian",
    quote:
      "I've really enjoyed the value and energy @itspatmorgan brings to Design Twitter. I've learned so much! If you're not following him already, I recommend it and subscribe to his newsletter, Unknown Arts.",
  },
  {
    name: "Joshua Newton",
    role: "Product Design @ Microsoft AI",
    quote:
      "Pat is driving the design industry forward. I love his newsletter because he talks with relevancy on growing subjects such as design entrepreneurship and how the industry is evolving. His honest and transparent style makes him one of a kind.",
  },
  {
    name: "Praful Krishna",
    role: "Product @ Meta",
    quote:
      "The most advanced technology is not always the best answer. This article by Patrick Morgan makes a very important point in the field of product management. A new innovation must push the need but should still relate to the existing paradigms in the customers' mind.",
  },
  {
    name: "Amy Mitchell",
    role: "Product Director @ Dell",
    quote:
      "Weekend Reading: Using design thinking to effect change. Here is a new framework from Patrick Morgan to create, present, and execute new ideas through persuasion and influence. Lots of fresh ideas!",
  },
  {
    name: "Michael Riddering",
    role: "Founder @ Figma Academy",
    quote:
      "You're definitely in my top ~3 writers bucket right now. Genuinely look forward to everything you post and the quality is consistently top-notch.",
  },
  {
    name: "Alex Cristache",
    role: "Design Director",
    quote:
      "\"Unknown Arts\" was the first newsletter I subscribed to when I decided to kickstart my Twitter adventure. And it has never disappointed. Every edition is complex, comprehensive, well written, and well studied.",
  },
  {
    name: "Grace Ling",
    role: "Founder @ Design Buddies",
    quote: "Practical insights to help you level up your design career!",
  },
  {
    name: "Peter Vogt",
    role: "Design Engineer @ CapitalOne",
    quote:
      "@itspatmorgan shares brilliant insights about design careers that are hard to find elsewhere. His newsletter is great.",
  },
  {
    name: "Ben Strak",
    role: "Design @ Monzo",
    quote:
      "I love the combination of personal stories and practical resources Patrick shares, something new and interesting every week—highly recommended!",
  },
  {
    name: "Raika Sarkett",
    role: "Conversation Design @ Amazon",
    quote:
      "If you work in tech, you definitely need to check out Pat's newsletter!",
  },
  {
    name: "Nate Kadlac",
    role: "Founder @ Approachable Design",
    quote:
      "I appreciate Patrick's fresh perspective on how to view design, both through the craft as well as through mindful principles.",
  },
  {
    name: "Damian Martone",
    role: "Founder @ Hatch Conference",
    quote:
      "Is a design background just another skill when starting a business? Or is it a big advantage? Patrick shared a wonderful article where some great folks describe their journeys and learnings.",
  },
  {
    name: "Kaitie Chambers",
    role: "Advocate @ Figma",
    quote:
      "This is brilliant! I love how you break down the steps and zoom out all the way to file management and then back down to the details of frame naming. Incredible!",
  },
  {
    name: "Fawzi Ammache",
    role: "Product Design @ RBC",
    quote:
      "Thorough breakdowns and analysis of the physical and digital products that have shaped our world from the amazing Pat Morgan!",
  },
  {
    name: "Joe Salowitz",
    role: "Product Design @ Sublime Security",
    quote:
      "SUPER highly recommend subscribing to @itspatmorgan's newsletter. It's always filled with really insightful nuggets of wisdom about design, entrepreneurship, business and more!",
  },
  {
    name: "Ehsan Nour",
    role: "Product Design @ Eraser",
    quote: "Patrick turned it up to 11 recently.",
  },
];

/** Curated subset for the home page */
export const homeCommendations = commendations.slice(0, 6);
