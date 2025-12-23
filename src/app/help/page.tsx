import HelpClient from "../../components/HelpClient";

export const metadata = {
  title: "Help Center | Flip Finder",
  description: "Guides, troubleshooting, and support for your AI thrift companion.",
};

export default function HelpPage() {
  // In a real-world scenario, you could fetch help articles 
  // from a CMS or Database here.
  return <HelpClient />;
}