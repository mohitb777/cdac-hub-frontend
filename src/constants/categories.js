// Single source of truth for project categories.
// Every component that needs this list imports it from here —
// change a category once, it updates everywhere. No more drift
// between SubmitProjectPage and AdminPage having different lists.
export const CATEGORIES = [
  "AI & ML",
  "Web Dev",
  "Mobile Apps",
  "Cybersecurity",
  "Cloud & DevOps",
  "Data Science",
  "Blockchain",
  "IoT",
];
