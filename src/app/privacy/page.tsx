import PrivacyClient from "../../components/PrivacyClient";

export const metadata = {
  title: "Privacy Policy | Flip Savvy",
  description: "Learn how Flip Savvy protects your data and manages your uploaded images.",
};

export default function PrivacyPage() {
  // Logic: Static for now, but ready for dynamic data 
  // if legal updates are ever pulled from a database.
  return <PrivacyClient />;
}